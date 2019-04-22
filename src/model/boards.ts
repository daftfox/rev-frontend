import IBoard from "../interface/board";
import { Observable } from 'rxjs';
import {Subject} from "rxjs/internal/Subject";
import BoardService from '../service/board-service';

class Boards {
    private _boards: IBoard[] = [];
    private $boards = new Subject<IBoard[]>();
    private service: BoardService;

    constructor() {
        this.service = new BoardService( this );
    }

    public getBoards(): Observable<IBoard[]> {
        return this.$boards;
    }

    public setBoards( boards: IBoard[] ) {
        this._boards = boards;
        this.$boards.next( this._boards );
    }

    public add( board: IBoard ): void {
        this._boards.push( board );
        this.$boards.next( this._boards );
    }

    public update( board: IBoard ): void {
        this._boards[this._boards.findIndex( _board => _board.id === board.id )] = board;
        this.$boards.next( this._boards );
    }

    public remove( board: IBoard ): void {
        this._boards.splice( this._boards.findIndex( _board => _board.id === board.id ), 1 );
        this.$boards.next( this._boards );
    }
}

export default Boards;
export const boards = new Boards();