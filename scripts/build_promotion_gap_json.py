"""Builds data/promotion-gap.json for the dashboard from the data-projects outputs.

Usage: python scripts/build_promotion_gap_json.py <path to data-projects/women-promotion-gap>
"""
import json
import sys
from pathlib import Path

import pandas as pd


def main(src: Path) -> None:
    out = src / "outputs"
    metrics = json.loads((out / "metrics.json").read_text())
    shares = pd.read_csv(out / "01_women_share_by_level.csv").set_index("industry")
    resign = pd.read_csv(out / "03_resignation_by_industry.csv").set_index("industry")
    gaps = pd.read_csv(out / "industry_gaps.csv").set_index("industry")

    promo = metrics["measures"]["promotion_to_manager"]
    res = metrics["measures"]["resignation"]
    overall = {
        "industry": "All industries",
        "share": metrics["women_share_pct"],
        "promotion": {
            "women": promo["rate_per_100"]["women"],
            "men": promo["rate_per_100"]["men"],
            "pooled": promo["women_to_men_ratio"]["crude"]["estimate"],
            "same_employer": promo["women_to_men_ratio"]["same_employer"]["estimate"],
            "ci95": promo["women_to_men_ratio"]["same_employer"]["ci95"],
        },
        "resignation": {"women": res["rate_per_100"]["women"], "men": res["rate_per_100"]["men"]},
    }

    industries = []
    for name in gaps.sort_values("same_employer_ratio").index:
        g, s, r = gaps.loc[name], shares.loc[name], resign.loc[name]
        industries.append(
            {
                "industry": name,
                "share": {
                    "non_managers": s.women_pct_of_non_managers,
                    "promotions_to_manager": s.women_pct_of_promotions,
                    "managers": s.women_pct_of_managers,
                },
                "promotion": {
                    "women": g.women_rate,
                    "men": g.men_rate,
                    "pooled": g.crude_ratio,
                    "same_employer": g.same_employer_ratio,
                    "ci95": [g.same_employer_ci95_low, g.same_employer_ci95_high],
                },
                "resignation": {"women": r.women_per_100, "men": r.men_per_100},
            }
        )

    data = {
        "employers": metrics["employers"],
        "employees": metrics["employees"],
        "ratios": {
            kind: {k: v["estimate"] for k, v in metrics["measures"][kind]["women_to_men_ratio"].items()}
            for kind in ("promotion_to_manager", "resignation")
        },
        "by_hours": pd.read_csv(out / "02_promotion_by_hours.csv").to_dict("records"),
        "overall": overall,
        "industries": industries,
        "replication": [
            {k: r[k] for k in ("year", "measure", "adjustment", "estimate", "ci95")} for r in metrics["replication"]
        ],
    }
    Path("data/promotion-gap.json").write_text(json.dumps(data, separators=(",", ":")))
    print(f"{len(industries)} industries")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
