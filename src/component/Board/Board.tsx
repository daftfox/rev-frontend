import * as React from 'react';
import IBoard from "../../interface/board";
import './Board.scss';
import IPin, {PIN_MODE} from "../../interface/pin";
import {boards} from "../../model/boards";
import ICommand from "../../interface/command";

class Board extends React.Component<{ board: IBoard }, { tab: string, screenOn: boolean, edit: boolean, board: IBoard, command: string, commandParams: string[], red: number, green: number, blue: number }> {
    constructor( props: { board: IBoard, heartbeat: boolean } ) {
        super( props );
        this.state = {
            tab: 'actions',
            edit: false,
            screenOn: true,
            board: props.board,
            command: '',
            commandParams: [],
            red: 128,
            green: 128,
            blue: 128,
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
                        this.props.board.availableCommands.map( ( command: ICommand, index ) =>
                            <tr key={index}>
                                <td>
                                    <button className={ `button terminal` }
                                            disabled={ !this.props.board.online }
                                            onClick={ () => this.handleCommandExecution( command ) }>
                                        { command.name }
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

    private handleCommandExecution( command: ICommand ): void {
        if ( !command.requiresParams ) {
            this.executeCommand( command.name );
        } else if ( command.name.indexOf( 'RGB' ) >= 0 ) {
            this.setState({
                command: command.name,
                tab: 'rgbSliders',
            });
        } else {
            this.setState({
                command: command.name,
                tab: 'parameters',
            });
        }
    }

    private getBoardPins(): JSX.Element {
        const digitalPins = this.props.board.pins.filter( pin => !pin.analog );
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
                                            <th>Pin</th>
                                            <th>Value</th>
                                            <th>Mode</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        splicedPins[0].map( ( pin: IPin, index: number ) =>
                                            !pin.analog ?
                                                <tr key={index}>
                                                    <td align={"center"}>D{ pin.pinNumber }</td>
                                                    <td align={"center"}>{ pin.value }</td>
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
                                            <th>Pin</th>
                                            <th>Value</th>
                                            <th>Mode</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        splicedPins[1].map( ( pin: IPin, index: number ) =>
                                            !pin.analog ?
                                                <tr key={index}>
                                                    <td align={"center"}>D{ pin.pinNumber }</td>
                                                    <td align={"center"}>{ pin.value }</td>
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
                        <th>Pin</th>
                        <th>Value</th>
                        <th>Mode</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.board.pins.map( ( pin: IPin, index: number ) =>
                            pin.analog ?
                                <tr key={index}>
                                    <td align={"center"}>A{ pin.pinNumber }</td>
                                    <td align={"center"}>{ pin.value }</td>
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

    private getCommandParameterInput() : JSX.Element {
        return (
            <div className={'command-parameter'}>
                <p>Enter the desired parameter(s). Separate parameters with commas if you wish to enter more than one.</p>
                <input type={'text'} placeholder={'Parameters'} onChange={ ( event ) => this.handleCommandParameterInput( event ) } />
                <div className={'command-parameter-controls'}>
                    <button className={'button'}
                            onClick={ () => this.returnToActions() }>
                        return
                    </button>
                    <button className={'button'}
                            onClick={ () => this.executeCommand( this.state.command, this.state.commandParams ) }>
                        execute
                    </button>
                </div>
            </div>
        )
    }

    private handleCommandParameterInput( event: React.FormEvent<HTMLInputElement> ): void {
        this.setState({
            commandParams: event.currentTarget.value.split(','),
        });
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
                                           value={ this.state.board.name || '' }/>
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
                                        <option value={ `LedController` }/>
                                    </datalist>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className={ `form-input` }>
                                    <label htmlFor={ `board-pinout` }>Device pinout: </label>
                                    <input id={ `board-pinout` }
                                           list={ `pinouts` }
                                           maxLength={ 20 }
                                           type={ `text` }
                                           name={ `pinout` }
                                           autoComplete={ `off` }
                                           onChange={ ( event ) => this.handleBoardEdits( event ) }
                                           value={ this.state.board.pinout }/>
                                    <datalist id={ `pinouts` }>
                                        <option value={ `Arduino Uno` }/>
                                        <option value={ `ESP8266` }/>
                                    </datalist>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    private setRGBColor( event: React.FormEvent<HTMLInputElement> ): void {
        const value = parseInt( event.currentTarget.value, 10 );
        switch ( event.currentTarget.name ) {
            case 'red':
                this.setState({
                    red: value,
                });
                break;
            case 'green':
                this.setState({
                    green: value,
                });
                break;
            case 'blue':
                this.setState({
                    blue: value,
                });
                break;
        }
    }

    private getRGBSliders(): JSX.Element {
        return (
            <div className={`sliders`}>
                <div className={'color-example'}
                     style={{backgroundColor: `rgb(${this.state.red}, ${this.state.green}, ${this.state.blue})`}} />
                <div className={`slider-container`}>
                    <input type="range"
                           name={`red`}
                           min="1"
                           max="255"
                           value={ this.state.red }
                           className="slider"
                           onChange={ ( event ) => this.setRGBColor( event ) }/>
                </div>
                <div className={`slider-container`}>
                    <input type="range"
                           name={`green`}
                           min="1"
                           max="255"
                           value={ this.state.green }
                           className="slider"
                           onChange={ ( event ) => this.setRGBColor( event ) }/>
                </div>
                <div className={`slider-container`}>
                    <input type="range"
                           name={`blue`}
                           min="0"
                           max="255"
                           value={ this.state.blue }
                           className="slider"
                           onChange={ ( event ) => this.setRGBColor( event ) }/>
                </div>
                <div className={`sliders-controls`}>
                    <button className={'button'}
                            onClick={() => this.returnToActions()}>
                        return
                    </button>
                    <button className={'button'}
                            onClick={() => this.executeCommand( this.state.command, [ this.state.red.toString(), this.state.green.toString(), this.state.blue.toString() ] )}>
                        execute
                    </button>
                </div>
            </div>
        );
    }

    private returnToActions(): void {
        this.setState({
            command: '',
            commandParams: [],
            tab: 'actions',
        });
    }

    private setTab( tab: string ): void {
        this.setState({
            tab: tab,
        });
    }

    private toggleEdit(): void {
        this.setState({
            edit: !this.state.edit,
        });
    }

    private executeCommand( command: string, parameters?: string[] ): void {
        boards.executeCommand( command, this.props.board.id, parameters );
    }

    componentWillReceiveProps( nextProps: Readonly<{ board: IBoard }>, nextContext: any ): void {
        const currentBoard = this.state.board;

        if ( this.state.edit ) {
            Object.assign( currentBoard, {
                online: nextProps.board.online,
                currentProgram: nextProps.board.currentProgram,
                pins: nextProps.board.pins,
                availableCommands: nextProps.board.availableCommands,
                lastUpdateReceived: nextProps.board.lastUpdateReceived,
            } );
        } else {
            Object.assign( currentBoard, nextProps.board );
        }

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
            case 'pinout':
                board.pinout = target.value;
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
                    <h1 className={"board-title"}>{this.props.board.name || 'Nameless'}</h1>
                    <table>
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td>{this.props.board.id}</td>
                            </tr>
                            <tr>
                                <td>Type</td>
                                <td>{this.props.board.type}</td>
                            </tr>
                            <tr>
                                <td>Pinout</td>
                                <td>{this.props.board.pinout}</td>
                            </tr>
                            <tr>
                                <td>Current job</td>
                                <td>{this.props.board.currentProgram}</td>
                            </tr>
                            <tr>
                                <td>Connection</td>
                                <td>{ this.props.board.serialConnection ? 'serial' : 'wireless' } { this.props.board.refreshRate ? `@ ${ 1000 / this.props.board.refreshRate }Hz` : null }</td>
                            </tr>
                            <tr>
                                <td>Online</td>
                                <td>{ this.props.board.online ? 'true' : 'false' }</td>
                            </tr>
                            <tr>
                                <td>Last update received</td>
                                <td>{ this.props.board.lastUpdateReceived }</td>
                            </tr>
                        </tbody>
                    </table>
                </header>
                <div className={"board-body"}>
                    {
                        !this.state.edit && this.state.tab === 'rgbSliders' ? this.getRGBSliders() : null
                    }
                    {
                        !this.state.edit && this.state.tab === 'parameters' ? this.getCommandParameterInput() : null
                    }
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
                                        disabled={ !this.props.board.online }
                                        onClick={ () => this.setTab( 'actions' ) }>
                                    actions
                                </button>
                                : null
                        }
                        {
                            !this.state.edit ?
                                <button className={`button ${ this.state.tab === 'pins' ? 'active' : null }`}
                                        disabled={ !this.props.board.pins.length }
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
