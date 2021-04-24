import React, { ReactNode, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { gsap } from "gsap";

type SquareValue = "X" | "O" | null;

// CALCULATE WINNER
const calculateWinner = (squares: SquareValue[]): SquareValue => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
};

// SQUARE PROPS
interface SquareProps {
    onClick(): void;
    value: SquareValue;
    index: Number;
}
const Square: React.FC<SquareProps> = (props) => {
    return (
        <button
            className={`square square${props.index}`}
            onClick={props.onClick}
        >
            <span>{props.value}</span>
        </button>
    );
};

// BOARD PROPS
interface BoardProps {
    onClick(i: number): void;
    squares: SquareValue[];
}
const Board: React.FC<BoardProps> = (props) => {
    const renderSquare = (i: number): ReactNode => {
        return (
            <Square
                value={props.squares[i]}
                index={i}
                onClick={() => props.onClick(i)}
            />
        );
    };

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
};

// GAME
const Game: React.FC = () => {
    const [xIsNext, setXIsNext] = useState<boolean>(true);
    const [stepNumber, setStepNumber] = useState<number>(0);
    const [history, setHistory] = useState<{ squares: SquareValue[] }[]>([
        {
            squares: Array(9).fill(null),
        },
    ]);

    const handleClick = (i: number): void => {
        const newHistory = history.slice(0, stepNumber + 1);
        const current = newHistory[newHistory.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? "X" : "O";
        setHistory(
            newHistory.concat([
                {
                    squares: squares,
                },
            ])
        );
        setStepNumber(newHistory.length);
        setXIsNext(!xIsNext);
        gsap.to(`.square${i} span`, {
            duration: 1,
            autoAlpha: 1,
            fontSize: 20,
            ease: "bounce.out",
        });
    };

    const jumpTo = (step: number): void => {
        setStepNumber(step);
        setXIsNext(step % 2 === 0);
    };

    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ? "Go to move #" + move : "Go to game start";
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status;
    const confetti = document.querySelector(".confetti");
    if (winner) {
        status = "Winner: " + winner;
        gsap.to(confetti, {
            duration: 1,
            display: "block",
            onComplete: () => {
                gsap.to(confetti, {
                    duration: 1,
                    autoAlpha: 1,
                });
            },
        });
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    return (
        <>
            <img
                className="confetti"
                src="https://i.pinimg.com/originals/7f/3a/68/7f3a68fe9ae08dfcfb26a0863a20d375.gif"
                alt="confetti"
            />
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        </>
    );
};

ReactDOM.render(<Game />, document.getElementById("root"));
