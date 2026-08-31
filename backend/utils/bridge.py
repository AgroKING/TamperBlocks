import subprocess
import json

APE_PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")  # utils/ -> backend/
)
def run_ape_script(script_name: str, args: list[str]) -> dict:
    # is the ONLY interface FastAPI has to the blockchain layer.
    #
    result = subprocess.run(
        ["ape", "run", script_name, *args],
        cwd=APE_PROJECT_ROOT,  # your Ape project root
        capture_output=True,
        text=True,
        timeout=60,
    )
    if result.returncode != 0:
        raise RuntimeError(f"Ape script failed: {result.stderr}")

    # last line of stdout is expected to be the JSON result
    last_line = result.stdout.strip().splitlines()[-1]
    return json.loads(last_line)
