"""Builds data/house-prices.json for the dashboard from the data-projects outputs.

Usage: python scripts/build_house_prices_json.py <path to data-projects/sydney-house-prices>
"""
import json
import sys
from pathlib import Path

import pandas as pd

MIN_SUBURB_SALES = 10
GAME_SALES = 240


def main(src: Path) -> None:
    sales = pd.read_csv(src / "data/sales.csv")
    sales["per_sqm"] = sales["price"] / sales["area_sqm"]

    quarters = pd.read_csv(src / "outputs/01_median_by_quarter.csv")
    quarters = quarters[quarters["quarter"].str.startswith("2018")]  # 2017 settlements are only partly covered

    suburbs = (
        sales.groupby("suburb")
        .agg(sales=("price", "size"), median_price=("price", "median"), median_per_sqm=("per_sqm", "median"), median_area=("area_sqm", "median"))
        .query("sales >= @MIN_SUBURB_SALES")
        .round(0)
        .reset_index()
        .sort_values("suburb")
    )

    test = pd.read_csv(src / "outputs/test_predictions.csv")
    game = test.sample(GAME_SALES, random_state=7).sort_values("contract_date")

    out = {
        "summary": {
            "raw_records": 210551,
            "sales": int(len(sales)),
            "sydney_median": int(sales["price"].median()),
        },
        "quarters": quarters.to_dict("records"),
        "extremes": pd.read_csv(src / "outputs/02_suburb_extremes.csv").to_dict("records"),
        "zoning": pd.read_csv(src / "outputs/03_zoning.csv").to_dict("records"),
        "metrics": json.loads((src / "outputs/metrics.json").read_text()),
        "suburbs": [
            {"name": r.suburb, "sales": int(r.sales), "price": int(r.median_price), "perSqm": int(r.median_per_sqm), "area": int(r.median_area)}
            for r in suburbs.itertuples()
        ],
        "game": [
            {"date": r.contract_date, "suburb": r.suburb, "area": round(float(r.area_sqm)), "price": int(r.price), "predicted": int(r.predicted)}
            for r in game.itertuples()
        ],
    }
    Path("data/house-prices.json").write_text(json.dumps(out, separators=(",", ":")))
    print(f"{len(out['suburbs'])} suburbs, {len(out['game'])} game sales")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
