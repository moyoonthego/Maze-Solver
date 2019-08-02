#################################################################
#                                                               #
#                          SOLUTION                             #
#                                                               #
#################################################################

# Weight function (2)
#   The weight between two pixels is simply how close pixel (b) is from
#   the colour white (255, 255, 255).
def how_white(mp, a, b):
    pb = mp.pixels[b]
    dst = (255-pb[0])**2 + (255-pb[1])**2 + (255-pb[2])**2
    return ((dst/100.0) ** 0.5) + 0.01

class Marcher:

    @staticmethod
    def findPath(mp, weight):
        # Set up required data structures
        pred, done, pr, pq = {(0, 0): None}, {}, {(0, 0): 0}, []
        target = (mp.sx - 1, mp.sy - 1)

        # Add initial spot to queue
        Marcher.push(pq, (0, 0, 0))

        # Standard Dijkstra loop
        while pq:
            (_, x, y) = Marcher.pop(pq)

            # If we're done with this, skip (this lets us not
            #   have to implement decrease_priority)
            if (x, y) in done:
                continue
            done[(x, y)] = 0

            # If we reached goal, done
            if (x, y) == target:
                break

            # For all possible neighbours...
            for (nbx, nby) in [(x, y-1), (x+1, y), (x, y+1), (x-1, y)]:

                # If valid and not already expanded
                if (0 <= nbx < mp.sx and 0 <= nby < mp.sy and (nbx, nby) not in done):

                    # Get and update the costs as necessary
                    d = weight(mp, (x, y), (nbx, nby)) + pr[(x, y)]

                    if ((nbx, nby) not in pr) or (pr[(nbx, nby)] > d):
                        pred[(nbx, nby)] = (x, y)
                        pr[(nbx, nby)] = d
                        Marcher.push(pq, (d, nbx, nby))

        # Backtrack and construct the path
        totalcost = pr[(x, y)]

        while (target is not None):
            mp.path.insert(0, target)
            target = pred[target]

        print('Cost: ' + str(totalcost), end=", ")
        print('Length: ' + str(len(mp.path)), end=", ")
        print('Nodes expanded: ' + str(len(done)))

        return totalcost

    @staticmethod
    def push(pq, a):
        # Add to the end
        pq.append(a)
        cur = len(pq) - 1

        # Swap with parent while smaller
        PARENT = ((cur + 1) // 2) - 1
        while (PARENT > 0 and pq[cur][0] < pq[PARENT][0]):
            pq[PARENT], pq[cur] = pq[cur], pq[PARENT]
            cur = PARENT
            PARENT = ((cur + 1) // 2) - 1

    @staticmethod
    def pop(pq):
        if len(pq) == 1:
            return pq.pop()

        # Replace min with last element
        ret = pq[0]
        pq[0] = pq.pop()

        # Keep swapping with smallest child if any of them is smaller
        low, cur = 0, 0
        l = len(pq)
        while(True):

            cur = low

            RCHILD = (cur+1) * 2
            LCHILD = RCHILD - 1

            if (LCHILD < l and pq[LCHILD][0] < pq[low][0]):
                low = LCHILD
            if (RCHILD < l and pq[RCHILD][0] < pq[low][0]):
                low = RCHILD
            if (cur == low):
                # Standard Dijkstra loop
                break

            pq[low], pq[cur] = pq[cur], pq[low]

        return ret
	
# actual solution
def solve(filepath):
    inp = Map(filepath)
    cost = Marcher.findPath(inp, how_white)
    inp.outputPath()
