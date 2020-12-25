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
  const [rolled, setRolled] = useState(false);
  const [bonusAdeed, setBonusAdded] = useState(false);
  console.log(histories);
  return (
    <div className="App">
      <Context.Provider value={{ race: race, firstStatus: firstStatus, secondStatus: secondStatus, histories: histories, status: status, coin: coin }}>
        <ViewArea />
      </Context.Provider>
      <div className="stateValueWrapper">
        <p>現在の状態値の出目:{stateValues.join()}</p>
      </div>
      <Context.Provider value={{ race: race, setRace: setRace }}>
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
    </div>
  );
}

function InputArea() {
  const races = require("./race.json");
  const table = require("./table.json");
  const statusTable = require("./status.json");
  const { register, handleSubmit, errors } = useForm();

  const oneDThree = () => { return Math.floor(Math.random() * (3 + 1 - 1)) + 1 };

  const raceChoices = () => {
    return Object.keys(races.種族).map((viewRace, index) => <option key={index} value={viewRace}>{viewRace}</option>);
  };

  const StatusChoice = (status) => {
    return Object.keys(status).map((key, index) => (<option key={index} value={key}>{key}</option>));
  };

  const valueChoice = () => {
    return stateValues.map((value, index) => <option key={index} value={value}>{value}</option>);
  }

  const sumStatus = () => {
    let sum = 0;
    Object.keys(firstStatus).forEach((key) => { sum += firstStatus[key] });
    Object.keys(secondStatus).forEach((key) => { sum += secondStatus[key] });
    return sum;
  };

  const raceSubmit = (data) => {
    setRace(races.種族[data.decided]);
    setRandomOrFixed(data.randomOrFixed);
    console.log(errors)
  };

  const reliefSubmit = (data) => {
    if (firstStatus[data.decided]) {
      setFirstStatus({ ...firstStatus, [data.decided]: 3 + statusTable.ランダム修正[race.name][0][data.decided] });
    } else if (secondStatus[data.decided]) {
      setSecondStatus({ ...secondStatus, [data.decided]: 3 + statusTable.ランダム修正[race.name][1][data.decided] });
    }
    setStatusReliefed(true);
  };

  const bonusSubmit = (data) => {
    setFirstStatus({ ...firstStatus, [data.decided]: firstStatus[data.decided] + 1 });
    setBonusAdded(true);
  };

  const stateValueSubmit = (data) => {
    if (data.decided === "yes") {
      setStateValues([5, 7, 9]);
    }
    setStateFixed(true);
  };

  const vitalitySubmit = (data) => {
    console.log(data);
    if (data.decided) {
      setStatus({ ...status, "生命力": parseInt(data.decided) + firstStatus.体力点 + firstStatus.魂魄点 + secondStatus.持久度 });
      const newValues = [...stateValues];
      newValues.splice(newValues.findIndex((element) => element === parseInt(data.decided)), 1);
      setStateValues(newValues);
    } else {
      return (<p>値を入力してください</p>);
    }
  };

  const moveSubmit = (data) => {
    if (data.decided) {
      console.log(race.move);
      setStatus({ ...status, "移動力": parseInt(data.decided) * race.move });
      const newValues = [...stateValues];
      newValues.splice(newValues.findIndex((element) => element === parseInt(data.decided)), 1);
      setStateValues(newValues);
    } else {
      return (<p>値を入力してください</p>);
    };
  };

  const decideSpellCount = () => {
    let spellCount;
    if (stateValues[0] >= 12) {
      spellCount = 3;
    } else if (stateValues[0] >= 10) {
      spellCount = 2;
    } else if (stateValues[0] >= 7) {
      spellCount = 1;
    } else {
      spellCount = 0;
    }
    setStatus({ ...status, "呪文回数": spellCount });
    const newValues = [...stateValues];
    newValues.splice(newValues.findIndex((element) => element === parseInt(stateValues[0])), 1);
    setStateValues(newValues);
  };

  const { race, setRace, firstStatus, setFirstStatus, secondStatus, setSecondStatus, histories, setHistories, stateValues, setStateValues, oneDSix, status, setStatus, coin, setCoin } = useContext(Context);
  const [randomOrFixed, setRandomOrFixed] = useState("");

  let inputArea;
  const [statusReliefed, setStatusReliefed] = useState(false);
  const [bonusAdded, setBonusAdded] = useState(false);
  const [stateFixed, setStateFixed] = useState(false);
  const [addedCoin, setAddedCoin] = useState(false);

  useEffect(() => {
    if (race.name !== "") {
      if (randomOrFixed === "fixed") {
        setFirstStatus({ "体力点": statusTable.固定値[race.name][0].体力点, "魂魄点": statusTable.固定値[race.name][0].魂魄点, "技量点": statusTable.固定値[race.name][0].技量点, "知力点": statusTable.固定値[race.name][0].知力点 });
        setSecondStatus({ "集中度": statusTable.固定値[race.name][1].集中度, "持久度": statusTable.固定値[race.name][1].持久度, "反射度": statusTable.固定値[race.name][1].反射度 });
        setRandomOrFixed("");
      } else if (randomOrFixed === "random") {
        setFirstStatus({ "体力点": oneDThree() + statusTable.ランダム修正[race.name][0].体力点, "魂魄点": oneDThree() + statusTable.ランダム修正[race.name][0].魂魄点, "技量点": oneDThree() + statusTable.ランダム修正[race.name][0].技量点, "知力点": oneDThree() + statusTable.ランダム修正[race.name][0].知力点 });
        setSecondStatus({ "集中度": oneDThree() + statusTable.ランダム修正[race.name][1].集中度, "持久度": oneDThree() + statusTable.ランダム修正[race.name][1].持久度, "反射度": oneDThree() + statusTable.ランダム修正[race.name][1].反射度 });
        setRandomOrFixed("");
      }

      if (histories.出自 === "" && histories.来歴 === "" && histories.邂逅 === "") {
        setHistories({ "出自": table.出自[race.name][oneDSix() + oneDSix() - 2], "来歴": table.来歴[oneDSix() + oneDSix() - 2], "邂逅": table.邂逅[oneDSix() + oneDSix() - 2] });

      }

      if (histories.出自.coin && !addedCoin) {
        setCoin(coin + (oneDSix() + oneDSix()) * histories.出自.coin);
        setAddedCoin(true);
      }

    }


  }, [race, randomOrFixed, setFirstStatus, setSecondStatus, statusTable.固定値, statusTable.ランダム修正, histories, setHistories, oneDSix, table, coin, setCoin, addedCoin]);

  if (race.name === "") {
    inputArea = (
      <form onSubmit={handleSubmit(raceSubmit)}>
        <p>種族と能力値をランダムにするか固定値にするか選択してください</p>
        <select name="decided" defaultValue={races.種族.只人.name} ref={register}>
          {raceChoices()}
        </select>
        <select name="randomOrFixed" defaultValue="random" ref={register}>
          <option value="random">ランダム</option>
          <option value="fixed">固定値</option>
        </select>
        <button type="submit">決定</button>
      </form>
    );
  } else if (sumStatus() <= 15 && !statusReliefed) {
    inputArea = (
      <form onSubmit={handleSubmit(reliefSubmit)}>
        <p>能力値合計が15以下なので好きな能力値の出目を3がでたことにできます</p>
        <select name="decided" defaultValue="使わない" ref={register}>
          <option value="使わない">使わない</option>
          {StatusChoice(firstStatus)}
          {StatusChoice(secondStatus)}
        </select>
        <button type="submit">決定</button>
      </form>
    );
  } else if (!bonusAdded) {
    inputArea = (
      <form onSubmit={handleSubmit(bonusSubmit)}>
        <p>ボーナスを加算する第一能力値を選択してください</p>
        <select name="decided" defaultValue="体力点" ref={register}>
          {StatusChoice(firstStatus)}
        </select>
        <button type="submit">決定</button>
      </form>
    );
  } else if (!stateFixed) {
    inputArea = (
      <form onSubmit={handleSubmit(stateValueSubmit)}>
        <p>状態値に固定値を使いますか？</p>
        <select name="decided" defaultValue="no" ref={register}>
          <option value="no">いいえ</option>
          <option value="yes">はい</option>
        </select>
        <button type="submit">決定</button>
      </form>
    );
  } else if (status.生命力 === 0) {
    inputArea = (
      <form onSubmit={handleSubmit(vitalitySubmit)}>
        <p>生命力に使う出目を選んでください</p>
        <select name="decided" ref={register}>
          <option value={null}> </option>
          {valueChoice()}
        </select>
        <button type="submit">決定</button>
      </form>
    );
  } else if (status.移動力 === 0) {
    inputArea = (
      <form onSubmit={handleSubmit(moveSubmit)}>
        <p>移動力に使う出目を選んでください</p>
        <select name="decided" ref={register}>
          <option value={null}> </option>
          {valueChoice()}
        </select>
        <button type="submit">決定</button>
      </form>
    );
  } else if (stateValues[0]) {
    decideSpellCount();
  } else {
    inputArea = (
      <p>キャラシ完成です</p>
    );
  }



  return (
    <div>
      {inputArea}
    </div>
  );
}

function DecisionRaceArea() {
  const races = require("./race.json");
  let decisionRaceArea;
  const { race, setRace } = useContext(Context);
  const { register, handleSubmit, errors } = useForm();

  const raceSubmit = (data) => {
    setRace(races.種族[data.decided]);
    console.log(errors)
  };

  const raceChoices = () => {
    return Object.keys(races.種族).map((viewRace, index) => <option key={index} value={viewRace}>{viewRace}</option>);
  };

  if (!race.name) {
    decisionRaceArea = (
      <div>
        <form onSubmit={handleSubmit(raceSubmit)}>
          <p>種族を選択してください</p>
          <select name="decided" defaultValue={races.種族.只人.name} ref={register}>
            {raceChoices()}
          </select>
          <button type="submit">決定</button>
        </form>
      </div>
    );
  } else {
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
      <div>
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
      <div>
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
    if (firstStatus[data.decided]) {
      setFirstStatus({ ...firstStatus, [data.decided]: 3 + statusTable.ランダム修正[race.name][0][data.decided] });
    } else if (secondStatus[data.decided]) {
      setSecondStatus({ ...secondStatus, [data.decided]: 3 + statusTable.ランダム修正[race.name][1][data.decided] });
    }
    setStatusReliefed(true);
  };

  if (sumStatus() <= 15 && !statusReliefed && rolled && race.name) {
    reliefStatusArea = (
      <div>
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
    setFirstStatus({ ...firstStatus, [data.decided]: firstStatus[data.decided] + 1 });
    setBonusAdded(true);
  };

  if (!bonusAdeed && rolled) {
    addBonusArea = (
      <form onSubmit={handleSubmit(bonusSubmit)}>
        <p>ボーナスを加算する第一能力値を選択してください</p>
        <select name="decided" defaultValue="体力点" ref={register}>
          {StatusChoice(firstStatus)}
        </select>
        <button type="submit">決定</button>
      </form>
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
    if (data.fixed === "true") {
      setStateValues([5, 7, 9]);
    }
    setUseStateValueFixed(true);
  };

  if (!useStateValueFixed && stateValues.length === 3) {
    stateValueFixedArea = (
      <form onSubmit={handleSubmit(stateValueSubmit)}>
        <p>状態値に固定値を使いますか？</p>
        <button type="submit" name="fixed" value="true" ref={register}>使う</button>
      </form>
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
    console.log(data);
    if (data.decided) {
      setStatus({ ...status, "生命力": parseInt(data.decided) + firstStatus.体力点 + firstStatus.魂魄点 + secondStatus.持久度 });
      const newValues = [...stateValues];
      newValues.splice(newValues.findIndex((element) => element === parseInt(data.decided)), 1);
      setStateValues(newValues);
      setVitalityDecision(true);
    } else {
      return (<p>値を入力してください</p>);
    }
  };

  if (!vitalityDecision) {
    vitalityDicisionArea = (
      <form onSubmit={handleSubmit(vitalitySubmit)}>
        <p>生命力に使う出目を選んでください</p>
        <select name="decided" ref={register}>
          <option value={null}> </option>
          {valueChoice()}
        </select>
        <button type="submit">決定</button>
      </form>
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
      <form onSubmit={handleSubmit(moveSubmit)}>
        <p>移動力に使う出目を選んでください</p>
        <select name="decided" ref={register}>
          <option value={null}> </option>
          {valueChoice()}
        </select>
        <button type="submit">決定</button>
      </form>
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
    let spellCount;
    if (data.decided >= 12) {
      spellCount = 3;
    } else if (data.decided >= 10) {
      spellCount = 2;
    } else if (data.decided >= 7) {
      spellCount = 1;
    } else if (data.decided) {
      spellCount = 0;
    } else {
      alert("値を入力してください");
      return "";
    }
    setStatus({ ...status, "呪文回数": spellCount });
    const newValues = [...stateValues];
    newValues.splice(newValues.findIndex((element) => element === parseInt(stateValues[0])), 1);
    setStateValues(newValues);
  };

  if (!status.呪文回数) {
    spellCountDecisionArea = (
      <form onSubmit={handleSubmit(decideSpellCount)}>
        <p>呪文使用回数に使う出目を選んでください</p>
        <select name="decided" ref={register}>
          <option value={null}> </option>
          {valueChoice()}
        </select>
        <button type="submit">決定</button>
      </form>
    );
  }

  return spellCountDecisionArea;
}

export default App;
export { Context };