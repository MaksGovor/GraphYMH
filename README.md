# Graph.Lab-1

Designation of some functions:

1) `doSymetrixMatrix(matrix)` - It takes in the input matrix and makes it symmetric for the non-directional graph

2) `graphTriangle(n)` - places the vertices of the graph in the form of a triangle, where n is the number of vertices

3) `findCoords(from, to, directed, arrowRadius)` - Searches for the coordinates of the exit and entrance of the rib, depending                                                    on whether it is strained

4) `drawArrowhead(ctx, from, to, arrowRadius)` - Draws the head of the arrow depending on where and where it is directed

5) `drawArrow(from, to, directed, arrowRadius)` - Draws an arrow from the specified point to the end, or the line if the graph                                                   is not directional
6) `drawCircle(from, directed)` - Draws a loop depending on whether the graph is strained or not

7) `evasion(from, to, event, directed, arrowRadius)` - The main function that draws the edges, calculates the bypass paths                                                            depending on the event
8) `checkOne(from, to, side)` - A function that checks for vertices on one side of a triangle

9) `check(from, to)` - Function that returns an event for the function evasion, depending on the location of 2 vertices

10) `edge(matrix, directed)` - A function that takes a matrix as input and, relative to the matrix, transfers corresponding                                    vertices in the cycle to the evasion
