import React from 'react';
import DeleteBtn from './DeleteBtn';
import ProgressBar from '@ramonak/react-progress-bar';

// Takes in the props of the list of items and makes a list of them
function ItemList(props) {
  return (
    <div
      style={{
        width: props.width ?? '50%',
        backgroundColor: '#FFDADA',
        margin: '5px',
        padding: '5px',
        borderRadius: '5%',
        textAlign: 'center',
      }}
    >
      <h1>{props.title}</h1>
      <ul style={{textAlign: 'left'}}>
        {props.items.map((item) => (
          <li key={item.id}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <input type="checkbox" />
              <span>{item.name}</span>
              <DeleteBtn />
            </div>
          </li>
        ))}
      </ul>
      {/* Add new item */}
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <input type="text" placeholder="Add new item" />
        <button style={{color: 'grey', backgroundColor: '#FF00FF55'}}>+</button>
      </div>
    </div>
  );
}

// Takes in the props of the list of items and makes a list of them
function BarList(props) {
  return (
    <div
      style={{
        width: props.width ?? '50%',
        backgroundColor: '#FFDADA',
        margin: '5px',
        padding: '5px',
        borderRadius: '5%',
        textAlign: 'center',
      }}
    >
      <h1>{props.title}</h1>
      <ul style={{textAlign: 'left', listStyle: 'none'}}>
        {props.items.map((item) => (
          // Remove the dot from the start of the line
          <li key={item.id}>
            <div style={{width: '100%', display: 'inline-block'}}>
              <span>{item.name}</span>
              <ProgressBar
                completed={item.progress}
                barColor={item.color}
                width="80%"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const weekGoalItems = [
  {id: 1, name: 'Do the dishes'},
  {id: 2, name: 'Do the laundry'},
  {id: 3, name: 'Something else'},
];

function WeekGoals(props) {
  return (
    <ItemList items={props.items} width={'50%'} title={'This weeks goals'} />
  );
}

const habitItems = [
  {id: 1, name: 'Do the dishes'},
  {id: 2, name: 'Do the laundry'},
  {id: 3, name: 'Something else'},
];

function Achievements(props) {
  return <ItemList items={props.items} width={'15%'} title={'Achievements'} />;
}

const avoidItems = [
  {id: 1, name: 'Do the dishes'},
  {id: 2, name: 'Do the laundry'},
  {id: 3, name: 'Something else'},
];

function Progress(props) {
  return <ItemList items={props.items} width={'15%'} title={'Progress'} />;
}

const rewardItems = [
  {id: 1, name: 'Health', progress: 25, barColor: 'yellow'},
  {id: 2, name: 'Social', progress: 50, barColor: 'blue'},
  {id: 3, name: 'Education', progress: 20, barColor: 'green'},
  {id: 4, name: 'Career', progress: 10, barColor: 'red'},
];

function Stats(props) {
  return <BarList items={props.items} width={'50%'} title={'???'} />;
}

function All(props) {
  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <WeekGoals items={weekGoalItems} />
      {/* <Achievements items={habitItems} />
      <Progress items={avoidItems} /> */}
      <Stats items={rewardItems} />
    </div>
  );
}

export default All;
