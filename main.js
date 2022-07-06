const canvas = document.getElementById('display');
const ctx = canvas.getContext('2d');

function fillBackground() {
    ctx.fillStyle = '#006';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function line(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke()
}

fillBackground();

let maze = 0;

function generate() {
    fillBackground();
    if(maze != 0) {
        maze.active = false;
    }
    maze = new Maze(parseInt(document.getElementById("dimension").value));
    maze.draw();
    maze.generate(maze);
}

class Cell {
    constructor(maze, x, y) {
        this.maze = maze
        this.visited = false;
        this.x = x;
        this.y = y;
        this.borders = [true, true, true, true] // up down left right
    }
    draw() {
        let cellPx = (canvas.width - 20) / this.maze.dimension;

        let oX = this.x * cellPx + 10;
        let oY = this.y * cellPx + 10;

        if (this.visited) {
            ctx.fillStyle = '#000';
            ctx.fillRect(oX, oY, cellPx, cellPx);
        } else {
            return
            ctx.fillStyle = '#006';
            ctx.fillRect(oX, oY, cellPx, cellPx);
        }


        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        if (this.borders[0]) {
            line(oX, oY, oX + cellPx, oY);
        }
        if (this.borders[1]) {
            line(oX, oY + cellPx, oX + cellPx, oY + cellPx);
        }
        if (this.borders[2]) {
            line(oX, oY, oX, oY + cellPx);
        }
        if (this.borders[3]) {
            line(oX + cellPx, oY, oX + cellPx, oY + cellPx);
        }

    }
}

class Maze {
    constructor(dimension) {
        this.active = true;
        this.dimension = dimension;
        this.maze = [];
        for (let i = 0; i < dimension; i++) {
            this.maze.push([]);
            for (let j = 0; j < dimension; j++) {
                this.maze[i].push(new Cell(this, i, j));
            }
        }
        this.maze[0][0].borders[2] = false;
        this.maze[dimension - 1][dimension - 1].borders[3] = false;

        this.currentCell = [this.maze[0][0],]
        this.currentCell[0].visited = true;
    }
    draw() {

        for (let i = 0; i < this.dimension; i++) {
            for (let j = 0; j < this.dimension; j++) {
                this.maze[i][j].draw();
            }
        }

    }
    generate(maze) {
        console.log(maze.currentCell)
        if (maze.currentCell.length == 0 || !maze.active) {
            return
        }
        let directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
        let validCells = [];
        let nextCell;
        let thisCell = maze.currentCell[0];
        for (let i = 0; i < directions.length; i++) {
            let newX = thisCell.x + directions[i][0];
            let newY = thisCell.y + directions[i][1];
            if (newX >= 0 && newX < maze.dimension &&
                newY >= 0 && newY < maze.dimension &&
                !maze.maze[newX][newY].visited) {
                validCells.push([i, maze.maze[newX][newY]]);
            }
        }
        if (validCells.length == 0) {
            maze.currentCell.splice(0, 1);
            maze.generate(maze);
            return
        } else {
            nextCell = validCells[Math.floor(Math.random() * validCells.length)];
        }

        maze.currentCell.unshift(nextCell[1]);
        // up down left right
        let reverse_direction_map = [1, 0, 3, 2];

        thisCell.borders[nextCell[0]] = false;
        nextCell[1].borders[reverse_direction_map[nextCell[0]]] = false;
        nextCell[1].visited = true;

        maze.draw();
        // maze.generate(maze);
        setTimeout(maze.generate, 1000 / parseInt(document.getElementById("speed").value), maze);
    }
}