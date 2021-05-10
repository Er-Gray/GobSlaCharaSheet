import React, { useState, createContext, useContext, useEffect } from "react";
import { useForm } from 'react-hook-form';
import ViewArea from "./ViewArea";
import './App.css';

const Context = createContext();
function App() {
  const oneDSix = () => { return Math.floor(Math.random() * (6 + 1 - 1)) + 1 };

  const [race, setRace] = useState({ "name": "", "generalSkill": ["", ""], "adventureSkill": ["", ""] });
  const [stateValues, setStateValues] = useState(Array(3).fill(0).map(() => { return oneDSix() + oneDSix() }));
  const [firstStatus, setFirstStatus] = useState({ "体力点": 0, "魂魄点": 0, "技量点": 0, "知力点": 0 });
  const [secondStatus, setSecondStatus] = useState({ "集中度": 0, "持久度": 0, "反射度": 0 });
  const [histories, setHistories] = useState({ "出自": "", "来歴": "", "邂逅": "" });
  const [status, setStatus] = useState({ "生命力": 0, "移動力": 0, "呪文回数": undefined });
  const [coin, setCoin] = useState(100);
  const [dayWalker,setDayWalker]=useState({"name":"","生得技能":[]});
  const [rolled, setRolled] = useState(false);
  const [bonusAdeed, setBonusAdded] = useState(false);
  console.log(dayWalker);
  return (
    <div className="App">
      <link rel="stylesheet" href="https://github.com/hankchizljaw/modern-css-reset/blob/master/dist/reset.css"></link>
      <Context.Provider value={{ race: race, firstStatus: firstStatus, secondStatus: secondStatus, histories: histories, status: status, coin: coin,dayWalker:dayWalker }}>
        <ViewArea />
      </Context.Provider>
      <div id="rightArea">
        <Context.Provider value={{ stateValues: stateValues }}>
          <StateValueViewArea />
        </Context.Provider>
        <Context.Provider value={{ race: race, setRace: setRace, histories: histories, setHistories: setHistories, coin: coin, setCoin: setCoin }}>
          <DecisionRaceArea />
        </Context.Provider>
        <Context.Provider value={{ setFirstStatus: setFirstStatus, setSecondStatus: setSecondStatus, race: race, setRolled: setRolled }}>
          <DecisionFirstAndSecondStatusArea />
        </Context.Provider>
        <Context.Provider value={{ firstStatus: firstStatus, setFirstStatus: setFirstStatus, secondStatus: secondStatus, setSecondStatus: setSecondStatus, race: race, rolled: rolled }}>
          <ReliefStatusArea />
        </Context.Provider>
        <Context.Provider value={{ firstStatus: firstStatus, setFirstStatus: setFirstStatus, rolled: rolled, bonusAdeed: bonusAdeed, setBonusAdded: setBonusAdded }}>
          <AddBonusArea />
        </Context.Provider>
        <Context.Provider value={{ stateValues: stateValues, setStateValues: setStateValues }}>
          <StateValueFixedArea />
        </Context.Provider>
        <Context.Provider value={{ status: status, setStatus: setStatus, stateValues: stateValues, setStateValues: setStateValues, firstStatus: firstStatus, secondStatus: secondStatus, bonusAdded: bonusAdeed }}>
          <VitalityDicisionArea />
        </Context.Provider>
        <Context.Provider value={{ status: status, setStatus: setStatus, stateValues: stateValues, setStateValues: setStateValues, race: race }}>
          <MovilityDecisionArea />
        </Context.Provider>
        <Context.Provider value={{ status: status, setStatus: setStatus, stateValues: stateValues, setStateValues: setStateValues }}>
          <SpellCountDecisionArea />
        </Context.Provider>
        <Context.Provider value={{ dayWalker: dayWalker,setDayWalker:setDayWalker }}>
          <UseDayWalker/>
        </Context.Provider>
      </div>
    </div>
  );
}

function StateValueViewArea() {
  const { stateValues } = useContext(Context);
  let stateValueViewArea = "";
  if (stateValues.length > 0) {
    stateValueViewArea = (
      <div className="area">
        <h2>現在の状態値の出目</h2>
        <p>{stateValues.join()}</p>
      </div>
    );
  }
  return stateValueViewArea;
}

function DecisionRaceArea() {
  const races = require("./race.json");
  const table = require("./table.json");
  let decisionRaceArea;
  const { race, setRace, histories, setHistories, coin, setCoin } = useContext(Context);
  const { register, handleSubmit, errors } = useForm();
  const [addedCoin, setAddedCoin] = useState(false);
  const [originalRace,setOriginalRace]=useState("");

  const oneDSix = () => { return Math.floor(Math.random() * (6 + 1 - 1)) + 1 };

  const raceSubmit = (data) => {
    setRace(races.種族[data.decided]);
    setOriginalRace(races.種族[data.decided].name);
    
    console.log(errors);
  };
  
  const originalRaceSubmit = (data) => {
    setOriginalRace(races.種族[data.decided].name);
    console.log(errors);
  };

  const raceChoices = (beastBindIn) => {
    if(beastBindIn){
      return Object.keys(races.種族).map((viewRace, index) => <option key={index} value={viewRace}>{viewRace}</option>);
    }else{
      return (Object.keys(races.種族).map((viewRace, index) => <option key={index} value={viewRace}>{viewRace}</option>)).filter((elm)=>elm.props.value!=="獣憑き");
    }
  };

  useEffect(() => {
    if (histories.出自 === "" && histories.来歴 === "" && histories.邂逅 === "" && race.name && originalRace!=="獣憑き" && originalRace!=="") {
      setHistories({ "出自": table.出自[originalRace.replace(/\(.*\)/,"")][oneDSix() + oneDSix() - 2], "来歴": table.来歴[oneDSix() + oneDSix() - 2], "邂逅": table.邂逅[oneDSix() + oneDSix() - 2] });

    }

    if (histories.出自.coin && !addedCoin) {
      setCoin(coin + (oneDSix() + oneDSix()) * histories.出自.coin);
      setAddedCoin(true);
    }
  }, [addedCoin, coin, table, histories, race, setCoin, setHistories,originalRace]);
  if(race.name==="獣憑き"&&originalRace==="獣憑き"){
    decisionRaceArea = (
      <div className="area">
        <h2>本来の種族選択</h2>
        <form onSubmit={handleSubmit(originalRaceSubmit)}>
          <p>本来の種族を選択してください</p>
          <select name="decided" defaultValue={races.種族.只人.name} ref={register}>
            {raceChoices(false)}
          </select>
          <button type="submit">決定</button>
        </form>
      </div>
    );
  }else if (!race.name) {
    decisionRaceArea = (
      <div className="area">
        <h2>種族選択</h2>
        <form onSubmit={handleSubmit(raceSubmit)}>
          <p>種族を選択してください</p>
          <select name="decided" defaultValue={races.種族.只人.name} ref={register}>
            {raceChoices(true)}
          </select>
          <button type="submit">決定</button>
        </form>
      </div>
    );
  }else {
    decisionRaceArea = "";
  }
  return decisionRaceArea;
}

function DecisionFirstAndSecondStatusArea() {
  const [firstStatusRoll, setFirstStatusRoll] = useState({ "体力点": 0, "魂魄点": 0, "技量点": 0, "知力点": 0 });
  const [secondStatusRoll, setSecondStatusRoll] = useState({ "集中度": 0, "持久度": 0, "反射度": 0 });
  const [randomStatus, setRandomStatus] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const { setFirstStatus, setSecondStatus, race, setRolled } = useContext(Context);
  const statusTable = require("./status.json");
  const oneDThree = () => { return Math.floor(Math.random() * (3 + 1 - 1)) + 1 };
  let DecisionFirstAndSecondStatusArea = "";

  const randomOrFixedSubmit = (data) => {
    console.log(errors);
    if (data.randomOrFixed === "random") {
      setFirstStatusRoll({ "体力点": oneDThree(), "魂魄点": oneDThree(), "技量点": oneDThree(), "知力点": oneDThree() });
      setSecondStatusRoll({ "集中度": oneDThree(), "持久度": oneDThree(), "反射度": oneDThree() });
      setRandomStatus(true);
      setRolled(true);
    } else if (data.randomOrFixed === "fixed") {
      if (!race.name) {
        alert("種族が選択されていません");
      } else {
        setFirstStatus({ "体力点": statusTable.固定値[race.name][0].体力点, "魂魄点": statusTable.固定値[race.name][0].魂魄点, "技量点": statusTable.固定値[race.name][0].技量点, "知力点": statusTable.固定値[race.name][0].知力点 });
        setSecondStatus({ "集中度": statusTable.固定値[race.name][1].集中度, "持久度": statusTable.固定値[race.name][1].持久度, "反射度": statusTable.固定値[race.name][1].反射度 });
        setFirstStatusRoll({ "体力点": statusTable.固定値[race.name][0].体力点, "魂魄点": statusTable.固定値[race.name][0].魂魄点, "技量点": statusTable.固定値[race.name][0].技量点, "知力点": statusTable.固定値[race.name][0].知力点 });
        setSecondStatusRoll({ "集中度": statusTable.固定値[race.name][1].集中度, "持久度": statusTable.固定値[race.name][1].持久度, "反射度": statusTable.固定値[race.name][1].反射度 });
      }
    }
  };

  if (randomStatus && race.name) {
    setFirstStatus({ "体力点": firstStatusRoll.体力点 + statusTable.ランダム修正[race.name][0].体力点, "魂魄点": firstStatusRoll.魂魄点 + statusTable.ランダム修正[race.name][0].魂魄点, "技量点": firstStatusRoll.技量点 + statusTable.ランダム修正[race.name][0].技量点, "知力点": firstStatusRoll.知力点 + statusTable.ランダム修正[race.name][0].知力点 });
    setSecondStatus({ "集中度": secondStatusRoll.集中度 + statusTable.ランダム修正[race.name][1].集中度, "持久度": secondStatusRoll.持久度 + statusTable.ランダム修正[race.name][1].持久度, "反射度": secondStatusRoll.反射度 + statusTable.ランダム修正[race.name][1].反射度 });
    setRandomStatus(false);
  }

  if (!firstStatusRoll.体力点 && !secondStatusRoll.集中度) {
    DecisionFirstAndSecondStatusArea = (
      <div className="area">
        <h2>能力値ダイスor固定値</h2>
        <form onSubmit={handleSubmit(randomOrFixedSubmit)}>
          <p>種族と能力値をランダムにするか固定値にするか選択してください</p>
          <input type="radio" name="randomOrFixed" value="random" ref={register} />ランダム
        <input type="radio" name="randomOrFixed" value="fixed" ref={register} />固定値
        <button type="submit">決定</button>
        </form>
      </div>
    );
  } else if (randomStatus) {
    DecisionFirstAndSecondStatusArea = (
      <div className="area">
        <h2>能力値の出目</h2>
        <h3>第一能力値</h3>
        <p>体力点:{firstStatusRoll.体力点} 魂魄点:{firstStatusRoll.魂魄点} 技量点:{firstStatusRoll.技量点} 知力点:{firstStatusRoll.知力点}</p>
        <h3>第二能力値</h3>
        <p>集中度:{secondStatusRoll.集中度} 持久度:{secondStatusRoll.持久度} 反射度:{secondStatusRoll.反射度}</p>
      </div>
    );
  }

  return DecisionFirstAndSecondStatusArea;
}

function ReliefStatusArea() {
  const { firstStatus, setFirstStatus, secondStatus, setSecondStatus, race, rolled } = useContext(Context);
  const { register, handleSubmit, errors } = useForm();
  const [statusReliefed, setStatusReliefed] = useState(false);
  const statusTable = require("./status.json");
  let reliefStatusArea = "";
  const sumStatus = () => {
    let sum = 0;
    Object.keys(firstStatus).forEach((key) => { sum += firstStatus[key] });
    Object.keys(secondStatus).forEach((key) => { sum += secondStatus[key] });
    return sum;
  };

  const StatusChoice = (status) => {
    return Object.keys(status).map((key, index) => (<option key={index} value={key}>{key}</option>));
  };

  const reliefSubmit = (data) => {
    console.log(errors);
    if (firstStatus[data.decided]!==undefined) {
      setFirstStatus({ ...firstStatus, [data.decided]: 3 + statusTable.ランダム修正[race.name][0][data.decided] });
    } else if (secondStatus[data.decided]!==undefined) {;
      setSecondStatus({ ...secondStatus, [data.decided]: 3 + statusTable.ランダム修正[race.name][1][data.decided] });
    }
    setStatusReliefed(true);
  };

  if (sumStatus() <= 15 && !statusReliefed && rolled && race.name) {
    reliefStatusArea = (
      <div className="area">
        <h2>能力値の救済</h2>
        <form onSubmit={handleSubmit(reliefSubmit)}>
          <p>能力値合計が15以下なので好きな能力値の出目を3がでたことにできます</p>
          <select name="decided" defaultValue="使わない" ref={register}>
            <option value="使わない">使わない</option>
            {StatusChoice(firstStatus)}
            {StatusChoice(secondStatus)}
          </select>
          <button type="submit">決定</button>
        </form>
      </div>
    );
  }
  return reliefStatusArea;

}

function AddBonusArea() {
  const { firstStatus, setFirstStatus, rolled, bonusAdeed, setBonusAdded } = useContext(Context);
  const { register, handleSubmit, errors } = useForm();
  let addBonusArea = "";

  const StatusChoice = (status) => {
    return Object.keys(status).map((key, index) => (<option key={index} value={key}>{key}</option>));
  };

  const bonusSubmit = (data) => {
    console.log(errors);
    setFirstStatus({ ...firstStatus, [data.decided]: firstStatus[data.decided] + 1 });
    setBonusAdded(true);
  };

  if (!bonusAdeed && rolled) {
    addBonusArea = (
      <div className="area">
        <h2>第一能力値にボーナス加算</h2>
        <form onSubmit={handleSubmit(bonusSubmit)}>
          <p>ボーナスを加算する第一能力値を選択してください</p>
          <select name="decided" defaultValue="体力点" ref={register}>
            {StatusChoice(firstStatus)}
          </select>
          <button type="submit">決定</button>
        </form>
      </div>
    );
  }

  return addBonusArea;
}

function StateValueFixedArea() {
  const { stateValues, setStateValues } = useContext(Context);
  const [useStateValueFixed, setUseStateValueFixed] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  let stateValueFixedArea = "";

  const stateValueSubmit = (data) => {
    console.log(errors);
    if (data.fixed === "true") {
      setStateValues([5, 7, 9]);
    }
    setUseStateValueFixed(true);
  };

  if (!useStateValueFixed && stateValues.length === 3) {
    stateValueFixedArea = (
      <div className="area">
        <h2>状態値の固定値使用</h2>
        <form onSubmit={handleSubmit(stateValueSubmit)}>
          <p>状態値に固定値を使いますか？</p>
          <button type="submit" name="fixed" value="true" ref={register}>使う</button>
        </form>
      </div>
    );
  }

  return stateValueFixedArea;
}

function VitalityDicisionArea() {
  const { status, setStatus, stateValues, setStateValues, firstStatus, secondStatus, bonusAdded } = useContext(Context);
  const [vitalityDecision, setVitalityDecision] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  let vitalityDicisionArea = "";

  const valueChoice = () => {
    return stateValues.map((value, index) => <option key={index} value={value}>{value}</option>);
  }

  const vitalitySubmit = (data) => {
    console.log(errors);
    if (data.decided) {
      setStatus({ ...status, "生命力": parseInt(data.decided) + firstStatus.体力点 + firstStatus.魂魄点 + secondStatus.持久度 });
      const newValues = [...stateValues];
      newValues.splice(newValues.findIndex((element) => element === parseInt(data.decided)), 1);
      setStateValues(newValues);
      setVitalityDecision(true);
    } else {
      alert("値を入力してください");
    }
  };

  if (!vitalityDecision) {
    vitalityDicisionArea = (
      <div className="area">
        <h2>生命力決定</h2>
        <form onSubmit={handleSubmit(vitalitySubmit)}>
          <p>生命力に使う出目を選んでください</p>
          <select name="decided" ref={register}>
            <option value={null}> </option>
            {valueChoice()}
          </select>
          <button type="submit">決定</button>
        </form>
      </div>
    );
  }
  useEffect(() => {
    if (bonusAdded) {
      setStatus({ ...status, "生命力": status.生命力 + firstStatus.体力点 + firstStatus.魂魄点 + secondStatus.持久度 });
    }
  }, [bonusAdded, firstStatus.体力点, firstStatus.魂魄点, secondStatus.持久度, setStatus]);

  return vitalityDicisionArea;
}

function MovilityDecisionArea() {
  const { register, handleSubmit, errors } = useForm();
  const { status, setStatus, stateValues, setStateValues, race } = useContext(Context);
  let movilityDecisionArea = "";

  const valueChoice = () => {
    return stateValues.map((value, index) => <option key={index} value={value}>{value}</option>);
  }

  const moveSubmit = (data) => {
    console.log(errors);
    if (race.name) {
      if (data.decided) {
        console.log(race.move);
        setStatus({ ...status, "移動力": parseInt(data.decided) * race.move });
        const newValues = [...stateValues];
        newValues.splice(newValues.findIndex((element) => element === parseInt(data.decided)), 1);
        setStateValues(newValues);
      } else {
        alert("値を入力してください");
      };
    } else {
      alert("種族を決定してください");
    }
  };

  if (status.移動力 === 0) {
    movilityDecisionArea = (
      <div className="area">
        <h2>移動力決定</h2>
        <form onSubmit={handleSubmit(moveSubmit)}>
          <p>移動力に使う出目を選んでください</p>
          <select name="decided" ref={register}>
            <option value={null}> </option>
            {valueChoice()}
          </select>
          <button type="submit">決定</button>
        </form>
      </div>
    );
  }
  return movilityDecisionArea;
}

function SpellCountDecisionArea() {
  const { register, handleSubmit, errors } = useForm();
  const { status, setStatus, stateValues, setStateValues } = useContext(Context);
  let spellCountDecisionArea = "";

  const valueChoice = () => {
    return stateValues.map((value, index) => <option key={index} value={value}>{value}</option>);
  }

  const decideSpellCount = (data) => {
    console.log(errors);
    let spellCount;
    if (data.decided >= 12) {
      spellCount = 3;
    } else if (data.decided >= 10) {
      spellCount = 2;
    } else if (data.decided >= 7) {
      spellCount = 1;
    } else if (data.decided <= 6) {
      spellCount = 0;
    } else {
      alert("値を入力してください");
      return "";
    }
    console.log("sc:" + spellCount);
    setStatus({ ...status, "呪文回数": spellCount });
    const newValues = [...stateValues];
    newValues.splice(newValues.findIndex((element) => element === parseInt(data.decided)), 1);
    setStateValues(newValues);
  };

  if (status.呪文回数 === undefined) {
    spellCountDecisionArea = (
      <div className="area">
        <h2>呪文回数決定</h2>
        <form onSubmit={handleSubmit(decideSpellCount)}>
          <p>呪文使用回数に使う出目を選んでください</p>
          <select name="decided" ref={register}>
            <option value={null}> </option>
            {valueChoice()}
          </select>
          <button type="submit">決定</button>
        </form>
      </div>
    );
  }

  return spellCountDecisionArea;
}

function UseDayWalker(){
  const { register, handleSubmit, errors } = useForm();
  const {dayWalker,setDayWalker}=useContext(Context);
  const dayWalkerTable=require("./dayWalker.json")
  let UseDayWalkerArea="";

  const valueChoice = () => {
    return Object.keys(dayWalkerTable).map((value, index) => <option key={index} value={value}>{value}</option>);
  }

  const decideDayWalker=(data)=>{
    setDayWalker(dayWalkerTable[data.decided]);
  };

  if(dayWalker.name===""){
    UseDayWalkerArea=(
      <div className="area">
        <h2>昼歩く者の使用</h2>
        <form onSubmit={handleSubmit(decideDayWalker)}>
          <p>昼歩く者を使用するなら種族を選択し決定</p>
          <select name="decided" ref={register}>
            <option value={null}> </option>
            {valueChoice()}
          </select>
          <button type="submit">決定</button>
        </form>
      </div>
    );
  }else{
    UseDayWalkerArea="";
  }
  return UseDayWalkerArea;
}

export default App;
export { Context };
