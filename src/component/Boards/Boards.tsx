import * as React from 'react';
import IBoard from "../../interface/board";
import {boards as model} from "../../model/boards";
import Board from "../Board/Board";
import './Boards.scss';
import Monitor from "../Monitor/Monitor";

class Boards extends React.Component<{}, { boards: IBoard[] }> {

    constructor( props: any ) {
        super( props );

        this.state = {
            boards: []
        };
    }

    componentDidMount() {
        model.getBoards().subscribe(
            ( boards: IBoard[] ) => {
                this.setState({
                    boards: boards
                });
            }
        );
    }

    public render() {
        return (
            <section className={ "boards" }>
                <Monitor id={ "board-monitor" }>
                    {
                        this.state.boards.map( ( board: IBoard, index: number ) =>
                            <Board board={ board } key={ index }/>
                        )
                    }
                </Monitor>
            </section>
        );
    }
}

export default Boards;