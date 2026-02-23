import csv
import io
from typing import Any

from fastapi.responses import StreamingResponse


def generate_csv(data: list[dict[str, Any]], filename: str) -> StreamingResponse:
    if not data:
        output = io.StringIO()
        output.write("Sin datos")
        output.seek(0)
    else:
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        for row in data:
            writer.writerow({k: str(v) if v is not None else "" for k, v in row.items()})
        output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}.csv"},
    )
