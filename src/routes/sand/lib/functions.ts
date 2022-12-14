import type { Coordinate } from "./types"

export function fillDoubleArray(height: number, width: number) {
	return JSON.parse(JSON.stringify(Array(height).fill(Array(width).fill(false))))
}

/**
 * Returns the 3 neighbors of (i,j) (bottom, bottom-left, bottom-right)
 * @param i
 * @param j
 * @param array
 */
function getNeighbors(i: number, j: number, array: boolean[][]): boolean[] {
	if (i === array.length - 1) return [false, false, false]
	if (j === 0) return [array[i + 1][j], true, array[i + 1][j + 1]]
	if (j === array[0].length - 1) return [array[i + 1][j], array[i + 1][j - 1], true]
	return [array[i + 1][j], array[i + 1][j - 1], array[i + 1][j + 1]]
}

/**
 * Returns the immediate left and right neighbors of (i,j)
 * @param i
 * @param j
 * @param array
 */
function getLeftRight(i: number, j: number, array: boolean[][]): boolean[] {
	if (j === 0) return [true, array[i][j + 1]]
	if (j === array[0].length - 1) return [array[i][j - 1], true]
	return [array[i][j - 1], array[i][j + 1]]
}

/**
 * Returns `true` if (i,j) is not blocked
 * @param i
 * @param j
 * @param walls
 * @param sand
 */
function canMove(i: number, j: number, walls: boolean[][], sand: boolean[][]): boolean {
	const neighborWalls = getNeighbors(i, j, walls)
	const neighborSand = getNeighbors(i, j, sand)
	const neighbors: boolean[] = []

	for (let i = 0; i < neighborWalls.length; i++) {
		neighbors.push(neighborWalls[i] || neighborSand[i])
	}
	const diagonalCanMove = neighbors.findIndex((d) => d === false) >= 0
	if (!diagonalCanMove) return false
	if (!neighborWalls[0] && !neighborSand[0]) return true

	const leftRightWalls = getLeftRight(i, j, walls)
	const leftRightSand = getLeftRight(i, j, sand)
	return (
		!(neighborWalls[1] || neighborSand[1] || leftRightWalls[0] || leftRightSand[0]) ||
		!(neighborWalls[0] || neighborSand[0] || leftRightWalls[1] || leftRightSand[1])
	)
}

function getNextCoordinate(
	coordinate: Coordinate,
	walls: boolean[][],
	sand: boolean[][]
): Coordinate {
	const [i, j] = coordinate
	// check below
	if (!walls[i + 1][j] && !sand[i + 1][j]) {
		return [i + 1, j]
	}
	// check diagonal left
	if (!walls[i + 1][j - 1] && !sand[i + 1][j - 1] && !walls[i][j - 1] && !sand[i][j - 1]) {
		return [i + 1, j - 1]
	}
	// check diagonal right
	if (!walls[i + 1][j + 1] && !sand[i + 1][j + 1] && !walls[i][j + 1] && !sand[i][j + 1]) {
		return [i + 1, j + 1]
	}

	return [i, j]
}

/**
 * Computes the next frame
 * @param walls
 * @param sand
 * @returns Next sand state
 */
export function getNextFrame(
	walls: boolean[][],
	sand: boolean[][],
	dropPoint: number
): boolean[][] {
	const height = sand.length
	const width = sand[0].length
	const newSand = sand

	const movingSand: Coordinate[] = []
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (sand[i][j] && canMove(i, j, walls, sand)) movingSand.push([i, j])
		}
	}

	if (movingSand.length === 0) {
		// no sand, drop one
		newSand[0][dropPoint] = true
		return newSand
	}

	for (let i = 0; i < movingSand.length; i++) {
		const currentSandCoord = movingSand[i]
		newSand[currentSandCoord[0]][currentSandCoord[1]] = false
		if (currentSandCoord[0] !== height - 1) {
			const newCoord = getNextCoordinate(currentSandCoord, walls, sand)
			newSand[newCoord[0]][newCoord[1]] = true
		}
	}

	return newSand
}
