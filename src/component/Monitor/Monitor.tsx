import * as React from 'react';
import './Monitor.scss';
import {ReactNode} from "react";
import { webSocketService } from "../../service/web-socket-service";

class Monitor extends React.Component<{ id: string }, { connected: boolean, screenOn: boolean, dataReceived: boolean, displayChild: number, currentTerminalColor: string, terminalColors: string[], children: ReactNode[] }> {
    constructor( props: { id: string } ) {
        super( props );

        this.state = {
            connected: false,
            screenOn: true,
            dataReceived: false,
            displayChild: 0,
            currentTerminalColor: 'pink',
            terminalColors: [
                'red',
                'green',
                'pink'
            ],
            children: React.Children.toArray( this.props.children ),
        };

        webSocketService.addMessageReceivedListener( this.setDataLightOn.bind( this ) );
        webSocketService.addConnectionOpenListener( this.setConnected.bind( this ) );
        webSocketService.addConnectionClosedListener( this.setConnected.bind( this ) );
    }

    private setDataLightOn(): void {
        this.setState({
            dataReceived: true,
        });

        setTimeout(() => {
            this.setState({
                dataReceived: false,
            });
        }, 200);
    }

    componentWillReceiveProps(nextProps: Readonly<{ id: string, children?: ReactNode[] }>, nextContext: any): void {
        this.setState( {
            children: React.Children.toArray( nextProps.children ),
        } );
    }

    private setTerminalColor( color: string ): void {
        this.setState({
            currentTerminalColor: color,
        });
    }

    private toggleScreenOn(): void {
        this.setState({
            screenOn: !this.state.screenOn,
        });
    }

    private setVisibleChild( index: number ): void {
        this.setState({
            displayChild: index,
        });
    }

    private setConnected( connected: boolean ): void {
        this.setState({
            connected: connected,
        });
    }

    private getBoardContent(): JSX.Element {
        return (
            <div className={"board-content"}>
                { this.state.children[ this.state.displayChild ] }
            </div>
        );
    }

    private getDisconnectedContent(): JSX.Element {
        return (
            <div className={'disconnected-content'}>
                <div className={'disconnected-label'}>DISCONNECTED</div>
                <div>Attempting to (re)connect to service</div>
            </div>
        );
    }

    public render() {
        return (
            <article className={`monitor ${ this.state.currentTerminalColor }`}>
                <div className={`monitor-screen ${this.state.screenOn ? 'screen-on' : 'screen-off'}`}>
                    <div className={"monitor-screen-content"}>
                        {
                            this.state.connected ?
                                this.getBoardContent()
                                :
                                this.getDisconnectedContent()
                        }
                        <div className={ "monitor-controls" }>
                            {
                                this.state.connected ? this.state.children.map( ( child: ReactNode, index: number ) =>
                                        <button key={ index }
                                                onClick={ () => this.setVisibleChild( index ) }
                                                className={ `button ${ this.state.displayChild === index ? 'active' : null }` }>
                                            { index }
                                        </button>
                                    )
                                : null
                            }
                            <div className={"monitor-color-controls"}>
                                {
                                    this.state.terminalColors.map( ( color, index ) =>
                                        <button key={index}
                                                onClick={ () => this.setTerminalColor( color ) }
                                                className={ `button ${ this.state.currentTerminalColor === color ? 'active' : '' }` }>
                                            { color.charAt(0) }
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"monitor-rim"}>
                    <button onClick={() => this.toggleScreenOn()} />
                    <div className={ `light power ${ this.state.screenOn ? 'on' : null }` } />
                    <div className={ `light data ${ this.state.screenOn && this.state.dataReceived ? 'on' : null }` } />
                </div>
            </article>
        );
    }
}

export default Monitor;
