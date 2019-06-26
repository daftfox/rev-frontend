import * as React from 'react';
import IBoard from "../../interface/board";
import './Board.scss';
import IPin, {PIN_MODE} from "../../interface/pin";
import {boards} from "../../model/boards";

class Board extends React.Component<{ board: IBoard }, { tab: string, screenOn: boolean, edit: boolean, board: IBoard }> {
    constructor( props: { board: IBoard, heartbeat: boolean } ) {
        super( props );
        this.state = {
            tab: 'actions',
            edit: false,
            screenOn: true,
            board: props.board,
        };
    }

    private getModeName( mode: PIN_MODE ): string {
        const modes = Object.keys( PIN_MODE );
        return modes.filter( ( _mode: string ) => isNaN( parseInt( _mode ) ) )[ mode ] || 'NONE';
    }

    private getBoardActions(): JSX.Element {
        return (
            <section className={"board-actions"}>
                <table>
                    <thead>
                        <tr>
                            <th>Available actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.board.availableCommands.map( (command: {name: string, requiresParams: boolean}, index ) =>
                            command.requiresParams ? null :
                                <tr key={index}>
                                    <td>
                                        <button className={ `button terminal` }
                                                disabled={ !this.state.board.online }
                                                onClick={ () => this.executeCommand( command.name ) }>
                                            {command.name}
                                        </button>
                                    </td>
                                </tr>
                        )
                    }
                    </tbody>
                </table>
            </section>
        );
    }

    private getBoardPins(): JSX.Element {
        const digitalPins = this.state.board.pins.filter( pin => !pin.analog );
        const halfwayIndex = Math.ceil(digitalPins.length / 2);
        const splicedPins = [
            digitalPins.splice(0, halfwayIndex),
            digitalPins
        ];

        return (
            <section className={ "board-pins" }>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={3}>
                                Digital pins
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={"p-0"}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th >Pin</th>
                                            <th >Value</th>
                                            <th >Mode</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        splicedPins[0].map( ( pin: IPin, index: number ) =>
                                            !pin.analog ?
                                                <tr key={index}>
                                                    <td align={"center"}>D{ pin.pinNumber }</td>
                                                    <td align={"center"}>{pin.value}</td>
                                                    <td align={"center"}>{ this.getModeName( pin.mode ) }</td>
                                                </tr>
                                                : null
                                        )
                                    }
                                    </tbody>
                                </table>
                            </td>
                            <td className={"p-0"}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th >Pin</th>
                                            <th >Value</th>
                                            <th >Mode</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        splicedPins[1].map( ( pin: IPin, index: number ) =>
                                            !pin.analog ?
                                                <tr key={index}>
                                                    <td align={"center"}>D{ pin.pinNumber }</td>
                                                    <td align={"center"}>{pin.value}</td>
                                                    <td align={"center"}>{ this.getModeName( pin.mode ) }</td>
                                                </tr>
                                                : null
                                        )
                                    }
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table>
                    <thead>
                    <tr>
                        <th colSpan={3}>
                            Analog pins
                        </th>
                    </tr>
                    <tr>
                        <th >Pin</th>
                        <th >Value</th>
                        <th >Mode</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.board.pins.map( ( pin: IPin, index: number ) =>
                            pin.analog ?
                                <tr key={index}>
                                    <td align={"center"}>A{ pin.pinNumber }</td>
                                    <td align={"center"}>{pin.value}</td>
                                    <td align={"center"}>{ this.getModeName( pin.mode ) }</td>
                                </tr>
                                : null
                        )
                    }
                    </tbody>
                </table>
            </section>
        );
    }

    private getEditForm(): JSX.Element {
        return (
            <div className={ `board-edit` }>
                <table>
                    <thead>
                        <tr>
                            <th >Edit board</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className={ `form-input` }>
                                    <label htmlFor={ `board-name` }>Device name: </label>
                                    <input id={ `board-name` }
                                           maxLength={ 40 }
                                           type={ `text` }
                                           name={ `name` }
                                           onChange={ ( event ) => this.handleBoardEdits( event ) }
                                           value={ this.state.board.name }/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className={ `form-input` }>
                                    <label htmlFor={ `board-type` }>Device type: </label>
                                    <input id={ `board-type` }
                                           list={ `types` }
                                           maxLength={ 20 }
                                           type={ `text` }
                                           name={ `type` }
                                           autoComplete={ `off` }
                                           onChange={ ( event ) => this.handleBoardEdits( event ) }
                                           value={ this.state.board.type }/>
                                    <datalist id={ `types` }>
                                        <option value={ `MajorTom` }/>
                                        <option value={ `Board` }/>
                                    </datalist>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    private setTab( tab: string ): void {
        this.setState({
            tab: tab
        });
    }

    private toggleEdit(): void {
        this.setState({
            edit: !this.state.edit
        });
    }

    private executeCommand( command: string ): void {
        boards.executeCommand( command, this.state.board.id );
    }

    componentWillReceiveProps(nextProps: Readonly<{ board: IBoard }>, nextContext: any): void {
        const boardUpdates = {
            online: nextProps.board.online,
            currentProgram: nextProps.board.currentProgram,
            pins: nextProps.board.pins,
            lastUpdateReceived: nextProps.board.lastUpdateReceived,
        };

        const currentBoard = this.state.board;
        Object.assign( currentBoard, boardUpdates );

        this.setState({
            board: currentBoard,
        });
    }

    private handleBoardEdits( event: React.FormEvent<HTMLInputElement> ): void {
        const target = event.currentTarget;
        const board = this.state.board;

        switch( target.name ) {
            case 'name':
                board.name = target.value;
                break;
            case 'type':
                board.type = target.value;
                break;
        }

        this.setState( {
            board: board
        } );
    }

    private saveChanges(): void {
        boards.saveChanges( this.state.board );
        this.setState({
            edit: false,
        });
    }

    public render() {
        return (
            <article className={ "board" }>
                <header className={"board-header"}>
                    <h1 className={"board-title"}>{this.state.board.name || 'Nameless'}</h1>
                    <table>
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td>{this.state.board.id}</td>
                            </tr>
                            <tr>
                                <td>Type</td>
                                <td>{this.state.board.type}</td>
                            </tr>
                            <tr>
                                <td>Current job</td>
                                <td>{this.state.board.currentProgram}</td>
                            </tr>
                            <tr>
                                <td>Online</td>
                                <td>{ this.state.board.online ? 'true' : 'false' }</td>
                            </tr>
                            <tr>
                                <td>Last update received</td>
                                <td>{ this.state.board.lastUpdateReceived }</td>
                            </tr>
                        </tbody>
                    </table>
                </header>
                <div className={"board-body"}>
                    {
                        !this.state.edit && this.state.tab === 'actions' ? this.getBoardActions() : null
                    }
                    {
                        !this.state.edit && this.state.tab === 'pins' ? this.getBoardPins() : null
                    }
                    {
                        this.state.edit ? this.getEditForm() : null
                    }
                </div>
                <footer className={"board-footer"}>
                    <div className={"button-row"}>
                        {
                            !this.state.edit ?
                                <button className={`button ${ this.state.tab === 'actions' ? 'active' : null }`}
                                        disabled={ !this.state.board.online }
                                        onClick={ () => this.setTab( 'actions' ) }>
                                    actions
                                </button>
                                : null
                        }
                        {
                            !this.state.edit ?
                                <button className={`button ${ this.state.tab === 'pins' ? 'active' : null }`}
                                        disabled={ !this.state.board.pins.length }
                                        onClick={ () => this.setTab( 'pins' ) }>
                                    pins
                                </button>
                                : null
                        }
                        <button className={"button"}
                                onClick={ () => this.toggleEdit() }>
                            {
                                this.state.edit ? 'cancel' : 'edit'
                            }
                        </button>
                        {
                            this.state.edit ?
                                <button className={"button right"}
                                        onClick={ () => this.saveChanges() }>
                                    save
                                </button>
                                : null
                        }
                    </div>
                </footer>
            </article>
        );
    }
}

export default Board;