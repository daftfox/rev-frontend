import * as React from 'react';
import IBoard from "../../../interface/board";
import './Board.scss';
import MajorTom from './assets/images/MajorTom.png';
import MCU from './assets/images/mcu.png';
import CommandService from "../../../service/command-service";
import IPin, {PIN_MODE} from "../../../interface/pin";

class Board extends React.Component<{ board: IBoard, heartbeat: boolean }, { action: string }> {
    constructor( props: { board: IBoard, heartbeat: boolean } ) {
        super( props );
        this.state = {
            action: props.board.commands![0] || ''
        };
    }

    private getTypeIcon(): string {
        let icon: string;
        switch ( this.props.board.type ) {
            case 'MajorTom':
                icon = MajorTom;
                break;
            default:
                icon = MCU;
                break;
        }
        return icon;
    }

    private sendCommand(): void {
        CommandService.executeCommand( this.props.board.id, this.state.action );
    }

    public render() {
        return (
            <article className={ "board" }>
                <header className={ "board-header" }>
                    <img className={ "board-icon" } src={ this.getTypeIcon() } />
                    <h1 className={ "board-title" }>{ this.props.board.type }</h1>
                    <h2 className={ "board-subtitle" }>Unique identifier: { this.props.board.id }</h2>
                    <div className={ "board-heartbeat" }>
                        <div title={ "Heartbeat" } className={ `heartbeat ${ this.props.heartbeat ? 'pulse' : '' }` } />
                    </div>
                </header>
                <div className={"board-actions"}>
                    <h3 className={"board-actions-header"}>Available actions</h3>
                    {
                        this.props.board.commands ? (
                            <div className={"board-actions-form"}>
                                <select defaultValue={ this.state.action }
                                        onChange={ ( event ) => { this.setState( { action: event.target.value } ) } }>
                                    { this.props.board.commands!.map( ( command: string ) =>
                                        <option key={ command }
                                                value={ command }>
                                            { command }
                                        </option>)

                                    }
                                </select>
                                <button className={"rev-button"}
                                        onClick={ this.sendCommand.bind( this ) }>Execute</button>
                            </div>
                        ) : (
                            <span>This board doesn't have any available commands</span>
                        )
                    }
                </div>
                <div className={"board-pins"}>
                    <h3 className={"board-pins-header"}>Pins</h3>
                    {
                        this.props.board.pins.map( ( pin: IPin, index: number ) =>
                            <div key={index}>
                                <span>{pin.analog ? 'A' : 'D'}{pin.pinNumber}: </span><span>{pin.value} </span>
                            </div> )
                    }
                </div>
                <footer className={ "board-footer" }>
                    <span>current board job: </span>
                    <span className={ `board-status ${ this.props.board.currentJob === 'IDLE' ? 'available' : 'busy' }` }>{ this.props.board.currentJob }</span>
                </footer>
            </article>
        );
    }
}

export default Board;