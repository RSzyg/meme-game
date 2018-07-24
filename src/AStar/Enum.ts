enum TileType {
    Empty,
    Block,
    OneWay,
}
enum HeuristicFormula {
    Manhattan           = 1,
    MaxDXDY             = 2,
    DiagonalShortCut    = 3,
    Euclidean           = 4,
    EuclideanNoSQR      = 5,
    Custom1             = 6,
}
export {
    TileType,
    HeuristicFormula,
};
