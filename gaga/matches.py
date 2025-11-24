import requests
from bs4 import BeautifulSoup
import json

def fetchTpvlApi():
    url="https://www.tpvl.tw/_next/data/SdNW3_dMGUbPChh8iMDBo/cn/schedule/schedule.json"
    resp=requests.get(url)
    resp.raise_for_status()
    data=resp.json()
    return data

def parseTpvl(data):
    games=data["pageProps"]["apiRes"]["data"]["games"]
    tpvlData={}
    for g in games:
        date=g["gameDate"]
        time=g["gameTime"]
        court=g["venueName"]
        home=g["homeTeamName"]
        guest=g["awayTeamName"]
        gameNo=g["gameNo"]
        if date not in tpvlData:
            tpvlData[date]=[]
        tpvlData[date].append({
            "game_number":gameNo,
            "game_time":time,
            "game_court":court,
            "home_team":home,
            "guest_team":guest,
            "live_link":None
        })
    return tpvlData

def fetchTvlHtml():
    url="https://tvl.ctvba.org.tw/schedule-mix"
    resp=requests.get(url)
    resp.raise_for_status()
    return BeautifulSoup(resp.text,"html.parser")

def parseTvl(soup):
    tvlData={}
    daySections=soup.select(".schedule_item")

    for sec in daySections:
        date=sec.select_one(".title").get_text(strip=True)
        allMatches=[]
        rows=sec.select(".match_line")
        for row in rows:
            number = row.select_one(".match_no").get_text(strip=True)
            mt_raw = row.select_one(".match_type").get_text(strip=True)
            match_time = row.select_one(".match_time").get_text(strip=True)

            if "｜" in mt_raw:
                match_type, match_gender = [p.strip() for p in mt_raw.split("｜")]
            else:
                match_type = mt_raw
                match_gender = None

            court = row.select_one(".fs12.mb-0").get_text(strip=True)
            team_color_dark = row.select_one(".dark .team_name")
            team_color_light = row.select_one(".light .team_name")

            allMatches.append({
                "match_number": number,
                "match_type": match_type,
                "match_gender":match_gender,
                "match_time": match_time,
                "match_court":court,
                "team_color_dark": team_color_dark.get_text(strip=True)if team_color_dark else None,   # 依網頁規則 judgment
                "team_color_light": team_color_light.get_text(strip=True)if team_color_light else None
            })

        tvlData[date] = allMatches
    return tvlData

def merge(tpvl,tvl):
    allDates=sorted(set(tpvl.keys())|set(tvl.keys()))
    merged=[]
    for date in allDates:
        merged.append({
            "match_day":date,
            "match_on_day":[
                {
                    "tpvl_league":tpvl.get(date,[]),
                    "tvl_league":tvl.get(date,[])
                }
            ]
        })
    return merged

if __name__=="__main__":
    tpvlRaw=fetchTpvlApi()
    tpvlData=parseTpvl(tpvlRaw)

    tvlHtml=fetchTvlHtml()
    tvlData=parseTvl(tvlHtml)

    final=merge(tpvlData,tvlData)
    with open("volleyballSchedule.json", "w", encoding="utf-8")as f:
        json.dump(final,f,ensure_ascii=False,indent=4)
    print("已產生檔案")