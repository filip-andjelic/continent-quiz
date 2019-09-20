// External dependencies
import React from 'react';

export default class FooterComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const resetAction = this.props.actions.reset;
        const playAction = this.props.actions.play;
        const nextAction = this.props.actions.next;
        const backAction = this.props.actions.back;
        const finishAction = this.props.actions.finish;

        return (<div id="footer" className={this.props.position ? this.props.position + " footer" : "footer"}>
            {!!resetAction && (<button className='footer-btn home-btn' onClick={() => resetAction()}>
                <span className='home-image'/>
            </button>)}

            {!!backAction && (<button className='footer-btn return-btn'  onClick={() => backAction()}>
                <span className='return-image'/>
            </button>)}

            {!!playAction && (<button className='footer-btn play-btn'  onClick={() => playAction()}>
                <span className='play-image'/>
                <span>Play</span>
            </button>)}

            {!!nextAction && (<button className='footer-btn next-btn'  onClick={() => nextAction()}>
                Next
            </button>)}

            {!!finishAction && (<button className='footer-btn finish-btn'  onClick={() => finishAction()}>
                Finish
            </button>)}
        </div>);
    }
};

