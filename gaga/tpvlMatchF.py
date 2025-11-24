# tpvlScraper_fixed.py
# 依賴：requests, beautifulsoup4
# pip install requests beautifulsoup4

import requests
from bs4 import BeautifulSoup
import re
import json
from datetime import datetime

YEAR = 2025
OUTPUT_FILE = "tpvlSchedule.json"
TEAM_URLS = {
    "臺北伊斯特": "https://eastpower.tw/match-ups",
    "桃園雲豹": "https://ty-leopards-vb.com/schedule/schedule?futurePage=1&resultPage=1",
    "台中連莊": "https://winstreak-volleyball.com/schedule/schedule?futurePage=1",
    "台鋼天鷹": "https://skyhawks-volleyball.com/schedule/schedule?resultPage=1&futurePage=1",
}
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
}

# ---------- helpers ----------
def fetch_html(url):
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "html.parser")

def normalize_date_from_text(s):
    if not s:
        return None
    m = re.search(r'(\d{1,2})[./\-](\d{1,2})', s)
    if m:
        mo, da = int(m.group(1)), int(m.group(2))
        return f"{YEAR:04d}-{mo:02d}-{da:02d}"
    m2 = re.search(r'(\d{4})[./\-](\d{1,2})[./\-](\d{1,2})', s)
    if m2:
        y, mo, da = int(m2.group(1)), int(m2.group(2)), int(m2.group(3))
        return f"{y:04d}-{mo:02d}-{da:02d}"
    return None

def first_useful_text(tag):
    """Return first non-empty text child excluding labels like 主隊/客隊/VS/購票"""
    if not tag:
        return None
    for el in tag.find_all(['span','h2','div','p','strong'], recursive=True):
        txt = el.get_text(strip=True)
        if not txt:
            continue
        if txt in ("主隊","客隊","VS.","VS","VS","前往購票","購票連結","HOME"):
            continue
        # exclude pure parentheses like (六)
        if re.fullmatch(r'\(.{1,3}\)', txt):
            continue
        return txt
    return None

# ---------- WL template parser (連莊/雲豹/天鷹) ----------
def parseWlTemplate(soup):
    result = {}
    for div in soup.select("div.flex.flex-col.items-center.justify-center.w-full"):
        sections=div.select("div.w-full.flex.justify-center.items-center")
        if not sections:
            continue
        row=sections[0].select("div.w-[50%]")
        if len(row)!=3:
            continue
        left, middle, right = row
        guest = left.select_one("span.text-[20px]")
        guest = guest.get_text(strip=True) if guest else None

        home = right.select_one("span.text-[20px]")
        home = home.get_text(strip=True) if home else None

        # -------------------------------
        # 場次編號 / 日期 / 時間 / 場地
        # -------------------------------
        info_texts = [x.get_text(strip=True) for x in middle.select("span")]

        game_number = None
        game_date = None
        game_time = None
        game_court = None

        for t in info_texts:
            # 場次編號
            m = re.search(r'-\s*(\d+)\s*-', t)
            if m:
                game_number = "場次編號" + m.group(1)
            
            # 日期 11/23
            if re.search(r'\d{1,2}/\d{1,2}', t):
                game_date = normalize_date_from_text(t)
            
            # 時間 18:30
            if re.search(r'\d{1,2}:\d{2}', t):
                game_time = t

            # 場地（唯一中文且非日期時間）
            if re.search(r'[\u4e00-\u9fff]', t) and not re.search(r'\d', t):
                game_court = t

        if not game_date:
            continue

        match = {
            "game_number": game_number,
            "game_time": game_time,
            "game_court": game_court,
            "home_team": home,
            "guest_team": guest,
            "live_link": None
        }

        result.setdefault(game_date, []).append(match)

    return result

# ---------- EastPower Greenshift parser ----------
def parseEastpowerTemplate(soup, team_name_hint="臺北伊斯特"):
    result = {}
    # matches in li.gspbgrid_item or containers containing gspb-dynamic-title-element
    items = soup.select('li.gspbgrid_item')
    if not items:
        items = soup.find_all(lambda tag: tag.name == 'div' and tag.select_one('.gspb-dynamic-title-element'))
    for item in items:
        num_el = item.select_one('.gspb-dynamic-title-element')
        game_number = num_el.get_text(strip=True) if num_el else None
        root = item
        for _ in range(4):
            if root is None:
                break
            if root.select_one('.gspb_meta .gspb_meta_value'):
                break
            root = root.parent
        meta_vals = []
        if root:
            meta_vals = [sp.get_text(strip=True) for sp in root.select('.gspb_meta.gspb_meta_value') if sp.get_text(strip=True)]
        game_date = None
        game_time = None
        for txt in meta_vals:
            if not game_date and re.search(r'\d{1,2}[./\-]\d{1,2}', txt):
                game_date = normalize_date_from_text(txt)
            if not game_time and re.search(r'\d{1,2}[:：]\d{2}', txt):
                game_time = re.search(r'(\d{1,2}[:：]\d{2})', txt).group(1).replace('：',':')
        # venue
        venue_el = root.select_one('.location_link.gspb_meta_value') if root else None
        venue = venue_el.get_text(strip=True) if venue_el else None
        if not venue:
            for t in meta_vals:
                if re.search(r'[\u4e00-\u9fff]', t) and not re.search(r'\d{1,2}[:：]\d{2}', t) and not re.search(r'\d{1,2}[./\-]\d{1,2}', t):
                    venue = t
                    break
        team_candidates = []
        if item:
            for sp in item.select('.gspb_meta .gspb_meta_value'):
                tt = sp.get_text(strip=True)
                if not tt:
                    continue
                if re.search(r'\d{1,2}[./\-]\d{1,2}', tt) or re.search(r'\d{1,2}[:：]\d{2}', tt):
                    continue
                if tt in ("(日)","(六)","(五)","(四)","(三)","(二)","(一)"):
                    continue
                team_candidates.append(tt)
        home = None
        guest = None
        if len(team_candidates) >= 2:
            home = team_candidates[0]
            guest = team_candidates[1]
        else:
            h2s = [h.get_text(strip=True) for h in item.select('h2') if h.get_text(strip=True)]
            h2_filtered = [h for h in h2s if not re.search(r'場次編號', h) and h.upper() != 'VS.' and h.upper() != 'VS']
            if len(h2_filtered) >= 2:
                home, guest = h2_filtered[0], h2_filtered[1]
            elif len(h2_filtered) == 1:
                home = team_name_hint
                guest = h2_filtered[0]
            else:
                home = team_name_hint
                txt = item.get_text(" ", strip=True)
                other = re.findall(r'[\u4e00-\u9fff]{2,20}', txt)
                if other:
                    for o in other:
                        if team_name_hint not in o:
                            guest = o
                            break

        if not game_date:
            dd = re.search(r'(\d{1,2}[./\-]\d{1,2})', item.get_text(" ",strip=True))
            if dd:
                game_date = normalize_date_from_text(dd.group(1))

        if not game_date:
            continue

        match = {
            "game_number": game_number if game_number else None,
            "game_time": game_time if game_time else None,
            "game_court": venue if venue else None,
            "home_team": home if home else None,
            "guest_team": guest if guest else None,
            "live_link": None
        }
        result.setdefault(game_date, []).append(match)

    return result

# ---------- orchestrator ----------
def scrape_all_teams():
    merged = {}
    for team, url in TEAM_URLS.items():
        print(f"[scrape] {team} -> {url}")
        try:
            soup = fetch_html(url)
        except Exception as e:
            print(f"  [error] fetching {team}: {e}")
            continue
        # detect template
        if soup.select('li.gspbgrid_item') or soup.select('.gspb-dynamic-title-element'):
            parsed = parseEastpowerTemplate(soup, team_name_hint=team)
        else:
            parsed = parseWlTemplate(soup)
        # merge
        for d, matches in parsed.items():
            merged.setdefault(d, [])
            # ensure game_number string format "場次編號N" if present numeric
            for m in matches:
                gn = m.get("game_number")
                if gn and isinstance(gn,str):
                    # keep as is if already contains non-digit; else normalize
                    if re.search(r'\d', gn):
                        digits = re.search(r'(\d{1,4})', gn)
                        if digits:
                            m["game_number"] =digits.group(1)
                merged[d].append(m)
    return merged

def convert_to_format_A(merged_date_dict):
    out = []
    for date in sorted(merged_date_dict.keys()):
        out.append({
            "match_day": date,
            "match_on_day": [
                {
                    "tpvl_league": merged_date_dict[date],
                    "tvl_league": []
                }
            ]
        })
    return out

def main():
    merged = scrape_all_teams()
    formatted = convert_to_format_A(merged)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(formatted, f, ensure_ascii=False, indent=4)
    print(f"Saved {OUTPUT_FILE}, days: {len(formatted)}")

if __name__ == "__main__":
    main()
