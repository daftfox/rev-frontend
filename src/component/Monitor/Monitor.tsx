import * as React from 'react';
import './Monitor.scss';
import Toggle from "../Toggle/Toggle";
import {ReactNode} from "react";

class Monitor extends React.Component<{ id: string }, { screenOn: boolean, displayChild: number, children: ReactNode[] }> {
    constructor( props: { id: string } ) {
        super( props );
        this.state = {
            screenOn: true,
            displayChild: 0,
            children: React.Children.toArray( this.props.children ),
        };
    }

    componentWillReceiveProps(nextProps: Readonly<{ id: string, children?: ReactNode[] }>, nextContext: any): void {
        this.setState( {
            children: React.Children.toArray( nextProps.children ),
        } );
    }

    private toggleScreenOn( screenOn: boolean ) {
        this.setState({
            screenOn: screenOn
        });
    }

    private setVisibleChild( index: number ): void {
        this.setState({
            displayChild: index,
        });
    }

    public render() {
        return (
            <article className={`monitor pink`}>
                <div className={`monitor-screen ${this.state.screenOn ? 'screen-on' : 'screen-off'}`}>
                    <div className={"monitor-screen-content"}>
                        <div>
                            { this.state.children[ this.state.displayChild ] }
                        </div>
                        <div className={ "monitor-controls" }>
                            {
                                this.state.children.map( ( child: ReactNode, index: number ) =>
                                    <button key={ index }
                                            onClick={ () => this.setVisibleChild( index ) }
                                            className={ `button terminal medium ${ this.state.displayChild === index ? 'active' : '' }` }>
                                        { index }
                                    </button>
                                )
                            }
                            {/*<Toggle id={this.props.id}*/}
                            {/*        checked={this.state.screenOn}*/}
                            {/*        className={"toggle-monitor-on"}*/}
                            {/*        onChange={(checked) => this.toggleScreenOn(checked)}/>*/}
                        </div>
                    </div>
                </div>

            </article>
        );
    }
}

export default Monitor;