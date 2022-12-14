import type { Coordinate } from "./types"

export function fillDoubleArray(height: number, width: number) {
	return JSON.parse(JSON.stringify(Array(height).fill(Array(width).fill(false))))
}

/**
 * Returns the 5 neighbors of (i,j) (left, bottom-left, bottom, bottom-right, right)
 * @param i
 * @param j
 * @param array
 */
function getNeighbors(i: number, j: number, array: boolean[][]): boolean[] {
	if (i === array.length - 1) return [false, false, false, false, false]
	if (j === 0) return [true, true, array[i + 1][j], array[i + 1][j + 1], array[i][j + 1]]
	if (j === array[0].length - 1)
		return [array[i][j - 1], array[i + 1][j - 1], array[i + 1][j], true, true]
	return [
		array[i][j - 1],
		array[i + 1][j - 1],
		array[i + 1][j],
		array[i + 1][j + 1],
		array[i][j + 1],
	]
}

function arrayOr(array1: boolean[], array2: boolean[]): boolean[] {
	const or = []
	for (let i = 0; i < array1.length; i++) {
		or.push(array1[i] || array2[i])
	}
	return or
}

/**
 * Returns `true` if (i,j) is not blocked
 * @param i
 * @param j
 * @param walls
 * @param sand
 */
function canMove(i: number, j: number, walls: boolean[][], sand: boolean[][]): boolean {
	const neighborsSand = getNeighbors(i, j, sand)
	const neighborsWalls = getNeighbors(i, j, walls)
	const neighbors = arrayOr(neighborsSand, neighborsWalls)
	return !(
		(neighbors[0] && neighbors[2] && neighbors[4]) ||
		(neighbors[1] && neighbors[2] && neighbors[3])
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
