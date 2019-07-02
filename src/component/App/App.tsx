import * as React from 'react';
import './App.scss';
import Boards from "../Boards/Boards";
import IdleTimer from 'react-idle-timer';

class App extends React.Component<{}, { displayScreensaver: boolean }> {
    private readonly onIdle: ( e: Event ) => void;
    private readonly onAction: ( e: Event ) => void;
    private readonly screensaverTimeout = 1000 * 60 * 5;
    // private readonly screensaverTimeout = 1000 * 10;

    constructor( props: any ) {
        super( props );

        this.state = {
            displayScreensaver: false,
        };

        this.onIdle = this._onIdle.bind( this );
        this.onAction = this._onAction.bind( this );
    }

    _onIdle( e: Event ): void {
        this.setState({
            displayScreensaver: true,
        });
    }

    _onAction( e: Event ) {
        this.setState({
            displayScreensaver: false,
        });
    }

    render() {
        return (
            <div className="app">
                <IdleTimer element={ document }
                           onIdle={ this.onIdle }
                           onAction={ this.onAction }
                           debounce={ 250 }
                           timeout={ this.screensaverTimeout } />
            <Boards/>
            <video className={ `screensaver ${ this.state.displayScreensaver ? 'visible' : null }` }
                   autoPlay={ true }
                   loop>
                <source src="assets/videos/synthwave.mp4" type="video/mp4" />
            </video>
            </div>
        );
    }
}

export default App;
