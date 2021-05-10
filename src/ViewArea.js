import React, { useState, useContext, useEffect } from "react";
import { Context } from "./App";

function ViewArea() {
    const { race, firstStatus, secondStatus, histories, status, coin,dayWalker } = useContext(Context);
    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(
            `名前：【】　　種族：【 ${race.name ? race.name : ""} ${dayWalker.name ? `(${dayWalker.name})` : ""}】　　性別：【 】　　年齢：【  】　　PL：【  】
                
経歴：【  ${histories.出自.name ? histories.出自.name : ""}／ ${histories.来歴.name ? histories.来歴.name : ""} ／ ${histories.邂逅} 】　　等級：【 白磁等級 】
    
身体的特徴：【  】
    
経験点：【 3000 ／ 3000 】　　成長点：【 10 ／ 10 】
    
冒険回数：【 0 】　　冒険達成数：【 0 】

◆能力値
【能力値】                           [第二能力値]
［第一能力値］   【 集中度：${secondStatus.集中度} 】    【 持久度：${secondStatus.持久度} 】    【 反射度：${secondStatus.反射度} 】
【 体力点：${firstStatus.体力点} 】          [ ${firstStatus.体力点 + secondStatus.集中度} ]                   [ ${firstStatus.体力点 + secondStatus.持久度} ]                   [ ${firstStatus.体力点 + secondStatus.反射度} ]
【 魂魄点：${firstStatus.魂魄点} 】          [ ${firstStatus.魂魄点 + secondStatus.集中度} ]                   [ ${firstStatus.魂魄点 + secondStatus.持久度} ]                   [ ${firstStatus.魂魄点 + secondStatus.反射度} ]
【 技量点：${firstStatus.技量点} 】          [ ${firstStatus.技量点 + secondStatus.集中度} ]                   [ ${firstStatus.技量点 + secondStatus.持久度} ]                   [ ${firstStatus.技量点 + secondStatus.反射度} ]
【 知力点：${firstStatus.知力点} 】          [ ${firstStatus.知力点 + secondStatus.集中度} ]                   [ ${firstStatus.知力点 + secondStatus.持久度} ]                   [ ${firstStatus.知力点 + secondStatus.反射度} ]

生命力：【 ${status.生命力} 】　 　 生命力２倍：【 ${status.生命力 * 2} 】

移動力：【 ${status.移動力} 】　　　呪文使用回数：【 ${status.呪文回数 !== undefined ? status.呪文回数 : ""} 】

呪文抵抗基準値（魂魄反射+冒険者LV+技能補正）：【 ${firstStatus.魂魄点 + secondStatus.反射度 + 1} 】

◆冒険者レベル：【 1 】
職業レベル：【 ${histories.出自.profession ? histories.出自.profession : ""}：${histories.出自.profession ? 1 : ""} 】【 ： 】

◆冒険者技能　　初歩　／　習熟　／　熟達　／　達人　／　伝説　／　効果
${race.adventureSkill[0] ? `【${race.adventureSkill[0]}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}${race.adventureSkill[1] ? `【${race.adventureSkill[1]}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}${histories.出自.adventureSkill ? `【${histories.出自.adventureSkill}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}${histories.来歴.adventureSkill ? `【${histories.来歴.adventureSkill}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／` : ""}

◆一般技能 　 　初歩　／　習熟　／　熟達　／　達人　／　伝説　／　効果
${race.generalSkill[0] ? `【${race.generalSkill[0]}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}${race.generalSkill[1] ? `【${race.generalSkill[1]}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}${race.generalSkill[2] ? `【${race.generalSkill[2]}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}${histories.出自.generalSkill ? `【${histories.出自.generalSkill}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}${histories.来歴.generalSkill ? `【${histories.来歴.generalSkill}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／` : ""}

◆吸血鬼専用技能 　 　初歩　／　習熟　／　熟達　／　達人　／　伝説　／　効果
${dayWalker.生得技能[0] ? `【${dayWalker.生得技能[0]}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}${dayWalker.生得技能[1] ? `【${dayWalker.生得技能[1]}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}${dayWalker.生得技能[2] ? `【${dayWalker.生得技能[2]}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}${dayWalker.生得技能[3] ? `【${dayWalker.生得技能[3]}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}${dayWalker.生得技能[4] ? `【${dayWalker.生得技能[4]}】　 ●　　　　○　　　　○　　　　○　　 　 ○　 ／\n` : ""}

◆呪文
呪文行使基準値（知力集中or魂魄集中+技能補正）：【 ${firstStatus.知力点 + secondStatus.集中度} or ${firstStatus.魂魄点 + secondStatus.集中度} 】
真言：【 0 】　　奇跡：【 0 】　　祖竜：【 0 】　　精霊：【 0 】

◎習得呪文：

◆攻撃
命中基準値（技量集中）：【 ${firstStatus.技量点 + secondStatus.集中度} 】
近接：【 0 】　　弩弓：【 0 】　　投擲：【 0 】

◎武器：
【 () 】
用途／属性／射程：【  】 命中値合計：【  】 ダメージ：【  】
効果：

◎効力値
～14：変化無し　15～19：+1D6　20～24：+2D6　25～29：+3D6　30～39：+4D6　40～：+5D6

◆防御
回避基準値（技量反射+回避可能な職業LV+技能補正）：【 ${firstStatus.技量点 + secondStatus.反射度}+回避可能な職業LV+技能補正 】
盾受け基準値（技量反射+盾受け可能な職業LV+技能補正）：【 ${firstStatus.技量点 + secondStatus.反射度}+盾受け可能な職業LV+技能補正 】

◎鎧：
【 () 】
属性：【  】　　装甲値：【  】　　回避値補正：【  】　　移動力修正：【  】　　隠密性：【  】
効果：

◎盾：
【  】
属性：【  】　盾受け修正：【  】　　盾受け値：【  】　　隠密性：【  】
効果：

移動力合計：【 ${status.移動力} 】　　装甲値合計：【  】　　回避値合計：【 ${firstStatus.技量点 + secondStatus.反射度}+回避可能な職業LV+技能補正 】
盾受け基準値合計：【 ${firstStatus.技量点 + secondStatus.反射度}+盾受け可能な職業LV+技能補正 】　　隠密性合計：【  】

◆所持金
銀貨：${coin}枚

◆その他の所持品
冒険者ツール（鈎縄,楔*10,小槌,火口箱,背負い袋,水袋,携帯用食器,白墨,小刀,松明*6）
携帯食(一日セット)*７、衣類`)
    }, [race, firstStatus, secondStatus, histories, status, coin,dayWalker]);

    const copySheet = () => {
        navigator.clipboard.writeText(value)
            .then(() => {
                console.log('成功');
            })
            .catch(err => {
                console.error('ユーザが拒否、もしくはなんらかの理由で失敗');
            });
    };

    return (
        <div id="leftArea">
            <textarea readOnly value={value} id="charaSheetArea">

            </textarea>
            <br></br>
            <button type="button" onClick={copySheet()} id="copyButton">キャラシをクリップボードにコピー</button>
        </div>
    );
}

export default ViewArea;