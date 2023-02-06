import React from 'react';

import {
  ADD_TASK,
  DELETE_TASK,
  DELETE_REWARD,
  ADD_REWARD,
  COMPLETE_TASK,
  PURCHASE_REWARD,
} from '../utils/mutations';
import {client} from '../utils/gqlClient';

import {UserContext} from '../utils/userContext';

const configForKey = {
  tasks: {daily: false, negative: false},
  habits: {daily: true, negative: false},
  avoids: {daily: false, negative: true},
  rewards: {},
};

const titles = {
  tasks: 'To Dos',
  rewards: 'Rewards',
  habits: 'Habits',
  avoids: 'Avoids',
};

class TaskAddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: 10,
      title: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    const {value, name} = event.target;
    this.setState({[name]: value});
  };

  handleSubmit = async (event) => {
    if (this.state.value === '') {
      console.log('Item was not added');
      event.preventDefault();
      return;
    }

    const variables = {
      ...configForKey[this.props.itemKey],
      title: this.state.title,
      description: 'UNUSED_DESC',
      deadline: '2021-01-01',
      coins: Number(this.state.coins),
      xp: 10,
    };

    client.mutate({mutation: ADD_TASK, variables}).then((task) => {
      this.props.updateParent({...variables, id: task.data.addTask.id});

      console.log('Item was added', this.state.title, this.state.coins);
      this.setState({title: '', coins: 10});
    });
    event.preventDefault();
  };

  render() {
    return (
      <form
        style={{display: 'flex', justifyContent: 'center', width: '100%'}}
        onSubmit={this.handleSubmit}
      >
        <input
          type="text"
          name="title"
          placeholder="Add new item"
          value={this.state.title}
          onChange={this.handleChange}
          style={{width: '60%'}}
        />
        <input
          type="number"
          name="coins"
          placeholder={10}
          value={this.state.coins}
          onChange={this.handleChange}
          style={{width: '20%'}}
        />
        <input
          type="submit"
          value="+"
          style={{color: 'grey', backgroundColor: '#FF00FF55'}}
        />
      </form>
    );
  }
}

class RewardAddForm extends TaskAddForm {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      cost: 10,
    };
  }

  handleSubmit = async (event) => {
    if (this.state.value === '') {
      console.log('Reward was not added');
      event.preventDefault();
      return;
    }

    const variables = {
      ...configForKey[this.props.itemKey],
      title: this.state.title,
      description: 'UNUSED_DESC',
      cost: Number(this.state.cost),
    };

    client.mutate({mutation: ADD_REWARD, variables}).then((task) => {
      this.props.updateParent({...variables, id: task.data.addReward.id});

      console.log('Reward was added', this.state.title, this.state.cost);
      this.setState({cost: 10, title: ''});
    });
    event.preventDefault();
  };

  render() {
    return (
      <form
        style={{display: 'flex', justifyContent: 'center', width: '100%'}}
        onSubmit={this.handleSubmit}
      >
        <input
          type="text"
          name="title"
          placeholder="Add new reward"
          value={this.state.title}
          onChange={this.handleChange}
          style={{width: '60%'}}
        />
        <input
          type="number"
          name="cost"
          placeholder={10}
          value={this.state.cost}
          onChange={this.handleChange}
          style={{width: '20%'}}
        />
        <input
          type="submit"
          value="+"
          style={{color: 'grey', backgroundColor: '#FF00FF55'}}
        />
      </form>
    );
  }
}

const deleteTask = (id, updateParent) => {
  console.log('Delete task', id);
  client.mutate({mutation: DELETE_TASK, variables: {id}}).then(() => {
    console.log('Task deleted');
    updateParent(id);
  });
};

const deleteReward = (id, updateParent) => {
  console.log('Delete reward', id);
  client.mutate({mutation: DELETE_REWARD, variables: {id}}).then(() => {
    console.log('Reward deleted');
    updateParent(id);
  });
};

const completeTask = (id, updateParent, context) => {
  console.log('Complete task', id);
  client.mutate({mutation: COMPLETE_TASK, variables: {id}}).then((taskAfter) => {
    console.log('Task completed', taskAfter);
    context.setCoins(context.coins + taskAfter.data.completeTask.coins);
    context.setXP(context.xp + taskAfter.data.completeTask.xp);

    console.log('User coins updated', context.coins)
    updateParent(id, taskAfter.data.completeTask);
  });
};

class CompleteTaskBtn extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);

    
    this.state = {
      finished: props.finished,
      id: props.taskId,
      f: completeTask
    };
    
  }
  
  render() {
    return (
      <span
        role="button"
        onClick={() => this.state.finished ? () => {} : this.state.f(this.state.id, this.props.updateParent, this.context)}
        style={{color: this.state.finished ? 'green' : 'black'}}
      >
        Finish
      </span>
    );
  }
}

const completeReward = (id, updateParent, context) => {
  console.log('Complete reward', id);
  client.mutate({mutation: PURCHASE_REWARD, variables: {id}}).then((rewardAfter) => {
    console.log('Reward completed', rewardAfter);
    deleteReward(id, () => {});
    context.setCoins(context.coins - rewardAfter.data.purchaseReward.cost);
    updateParent(id, rewardAfter.data.purchaseReward);
  });
};

class CompleteRewardBtn extends CompleteTaskBtn {
  static contextType = UserContext;

  constructor(props) {
    super(props);

    this.state = {
      finished: props.finished,
      id: props.rewardId,
      f: completeReward,
    };
  }

  render() {
    return (
      <span
        role="button"
        onClick={() => this.state.finished ? () => {} : this.state.f(this.state.id, this.props.updateParent, this.context)}
        style={{color: this.state.finished ? 'green' : 'black'}}
      >
        Claim
      </span>
    );
  }
}



class DeleteTaskBtn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.taskId,
      f: deleteTask,
    };
  }

  render() {
    return (
      <span
        role="button"
        onClick={() => this.state.f(this.state.id, this.props.updateParent)}
      >
        ✗
      </span>
    );
  }
}

class DeleteRewardBtn extends DeleteTaskBtn {
  constructor(props) {
    super(props);

    this.state = {
      id: props.rewardId,
      f: deleteReward,
    };
  }
}

// Takes in the props of the list of items and makes a list of them
class ItemList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      itemKey: props.itemKey,
      items: props.items
    };

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items) {
      this.setState({items: this.props.items});
    }
  }

  addItem(item) {
    console.log('Add item', item);
    this.setState({items: [...this.state.items, item]});
  }

  removeItem(id) {
    console.log('Remove item', id);
    this.setState({items: this.state.items.filter((item) => item.id !== id)});
  }

  updateItem(id, newItem) {
    console.log('Update item', id, newItem);
    this.setState({
      items: this.state.items.map((item) => {
        if (item.id === id) {
          return newItem;
        }
        return item;
      }),
    });
  }

  render() {
    return (
      <div
        style={{
          width: this.props.width ?? '25%',
          backgroundColor: '#FFDADA',
          margin: '5px',
          padding: '5px',
          borderRadius: '5%',
          textAlign: 'center',
        }}
      >
        <h1>{titles[this.props.itemKey]}</h1>
        <ul style={{textAlign: 'left', listStyle: 'none', paddingLeft: 0}}>
          {this.state.items.map((item, i) => {
            return (
            <li key={this.props.itemKey + item.title + i + item.completedOn}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <CompleteTaskBtn taskId={item.id} finished={item.completedOn != null} updateXP={this.props.updateXP} updateParent={this.updateItem} />
                <span>{item.title}</span>
                <span>{item.coins}</span>
                <DeleteTaskBtn
                  taskId={item.id}
                  updateParent={this.removeItem}
                />
              </div>
            </li>
          )})}
        </ul>
        <TaskAddForm itemKey={this.state.itemKey} updateParent={this.addItem} />
      </div>
    );
  }
}

class RewardList extends ItemList {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {items: props.items};

    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  render() {
    return (
      <div
        style={{
          width: this.props.width ?? '25%',
          backgroundColor: '#FFDADA',
          margin: '5px',
          padding: '5px',
          borderRadius: '5%',
          textAlign: 'center',
          height: '100%',
        }}
      >
        <h1>{titles[this.props.itemKey]}</h1>
        <ul style={{textAlign: 'left'}}>
          {this.state.items.map((item, i) => (
            <li key={item.title + i}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <CompleteRewardBtn rewardId={item.id} updateParent={this.removeItem} />
                <span>{item.title}</span>
                <span>{item.cost}</span>
                <DeleteRewardBtn
                  rewardId={item.id}
                  updateParent={this.removeItem}
                />
              </div>
            </li>
          ))}
        </ul>
        <RewardAddForm
          itemKey={this.props.itemKey}
          updateParent={this.addItem}
        />
      </div>
    );
  }
}

function All(props) {
  const {taskData = [], rewardData = []} = props;
  const habitItems = taskData.filter((item) => item.daily);
  const avoidItems = taskData.filter((item) => item.negative);
  const taskItems = taskData.filter((item) => !item.daily && !item.negative);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '50px',
        marginTop: '50px',
        height: '40vh',
      }}
    >
      <ItemList items={taskItems} itemKey={'tasks'} {...props} />
      <ItemList items={habitItems} itemKey={'habits'} {...props}/>
      <ItemList items={avoidItems} itemKey={'avoids'} {...props}/>
      <RewardList items={rewardData} itemKey={'rewards'} {...props}/>
    </div>
  );
}

export default All;
