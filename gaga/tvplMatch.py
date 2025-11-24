import requests
from bs4 import BeautifulSoup
import json
from collections import defaultdict

urls = {
    #"eastpower": "https://eastpower.tw/match-ups",
    "team2": "https://ty-leopards-vb.com/schedule/schedule?futurePage=1&resultPage=1",
    "team3": "https://winstreak-volleyball.com/schedule/schedule?futurePage=1",
    "team4": "https://skyhawks-volleyball.com/schedule/schedule?resultPage=1&futurePage=1"
}

def parse_team(url):
    print("開始執行parse_team：",url)
    res = requests.get(url)
    res.encoding = 'utf-8'
    soup = BeautifulSoup(res.text, "html.parser")
    
    match_day_data = defaultdict(lambda: {"tpvl_league": [], "tvl_league": []})
    print("match_day_data建立成功")

    date_blocks = soup.find("div class='flex flex-col justify-center items-center'")  # 每個日期的區塊
    if not date_blocks:
        print("無日期")
        return match_day_data  # 沒有比賽的情況
    print("日期區塊建立成功")
    for date_block in date_blocks:
        # 日期
        date_tag = date_block.select_one("h2.date")
        match_day = date_tag.text.strip() if date_tag else ""

        # TPVL 賽事抓取
        tpvl_blocks = date_block.select("div.tpvl-game")
        for g in tpvl_blocks:
            game_number = g.select_one("span.game-number").text.strip() if g.select_one("span.game-number") else ""
            game_time = g.select_one("span.game-time").text.strip() if g.select_one("span.game-time") else ""
            game_court = g.select_one("span.game-court").text.strip() if g.select_one("span.game-court") else ""
            home_team = g.find_all("span class='wl-text text-left break-words text-white text-[20px] mb-2 text-left'").text.strip()
            guest_team = g.find_all("span class='wl-text text-left break-words text-white text-[20px] mb-2 text-right'").text.strip() if g.select_one("span.guest-team") else ""
            match_day_data[match_day]["tpvl_league"].append({
                "game_number": game_number,
                "game_time": game_time,
                "game_court": game_court,
                "home_team": home_team,
                "guest_team": guest_team,
                "live_link": "直播連結待補"
            })
        print("tpvl賽程抓取成功")

        # TVL 賽事抓取
        tvl_blocks = date_block.select("div.tvl-league")
        for t_block in tvl_blocks:
            '''game_court_tag = t_block.select_one("p.fs12.mb-0")
            game_court = game_court_tag.text.strip() if game_court_tag else ""
            match_data_list = []
            match_rows = t_block.select("div.match-row")
            for m in match_rows:
                match_number = m.select_one("span.match-number").text.strip() if m.select_one("span.match-number") else ""
                match_type = m.select_one("span.match-type").text.strip() if m.select_one("span.match-type") else ""
                match_gender = m.select_one("span.match-gender").text.strip() if m.select_one("span.match-gender") else ""
                match_time = m.select_one("span.match-time").text.strip() if m.select_one("span.match-time") else ""
                team_color_dark = m.select_one("span.team-dark").text.strip() if m.select_one("span.team-dark") else ""
                team_color_light = m.select_one("span.team-light").text.strip() if m.select_one("span.team-light") else ""
                match_data_list.append({
                    "match_number": match_number,
                    "match_type": match_type,
                    "match_gender": match_gender,
                    "match_time": match_time,
                    "team_color_dark": team_color_dark,
                    "team_color_light": team_color_light
                })'''
            match_day_data[match_day]["tvl_league"].append({
                "game_court": game_court,
                #"match_data": match_data_list
            })
            print("字典建立成功")

    return match_day_data


# 合併四隊比賽
all_data = defaultdict(lambda: {"match_on_day": []})
print("all_data建立成功")

for url in urls.values():
    team_data = parse_team(url)
    for match_day, leagues in team_data.items():
        # 每天新增到 match_on_day
        all_data[match_day]["match_on_day"].append(leagues)
    print("match_on_day建立成功",url)

# 將 defaultdict 轉成一般 dict
all_data_dict = {day: data for day, data in all_data.items()}
print("all_data_dict字典建立成功")

# 將最終結果寫入 JSON
with open("all_teams_schedule.json", "w", encoding="utf-8") as f:
    json.dump(all_data_dict, f, ensure_ascii=False, indent=4)

print("完成抓取並生成 tpvlSchedule.json")
