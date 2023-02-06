import React, {Component} from "react";



class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: props.progress
        }
    }

    render() {
        return (
            <div className="progress">
                <div className="progress-bar" role="progressbar" style={{width: `${this.state.progress}%`, backgroundColor: this.props.barColor}} aria-valuenow={this.state.progress} aria-valuemin="0" aria-valuemax="100">
                    {this.state.progress}%
                </div>
            </div>
        )
    }
}

export default ProgressBar;
