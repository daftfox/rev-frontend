import * as React from 'react';
import IBoard from "../../interface/board";
import {boards as model} from "../../model/boards";
import Board from "./Board/Board";
import './Boards.scss';

class Boards extends React.Component<{}, { boards: IBoard[], heartbeat: boolean }> {
    constructor( props: any ) {
        super( props );

        this.state = {
            boards: [],
            heartbeat: false
        };
    }

    componentDidMount() {
        model.getBoards().subscribe(
            ( boards: IBoard[] ) => {
                this.setState( { boards: boards } );
                this.pulseHeartbeat();
            }
        );
    }

    private pulseHeartbeat(): void {
        this.setState( { heartbeat: true } );
        setTimeout( () => {
            this.setState( { heartbeat: false } );
        }, 2000 );
    }

    public render() {
        return (
            <section className={ "boards" }>
                <header className={ "boards-header" }>
                    <h1 className={ "boards-title" }>Boards</h1>
                    <h2 className={ "boards-subtitle" }>Boards that are currently connected to the back-end service</h2>
                </header>

                <div className={"boards-list"}>
                    {
                        this.state.boards.map( ( board ) => <Board key={ board.id } board={ board } heartbeat={ this.state.heartbeat } />)
                    }
                </div>

            </section>
        );
    }
}

export default Boards;