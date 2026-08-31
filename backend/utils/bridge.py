import subprocess
import json
import os

APE_PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")  # utils/ -> backend/
)


def run_ape_script(script_name: str, args: list[str]) -> dict:
    # is the ONLY interface FastAPI has to the blockchain layer.
    # Arguments are passed via SCRIPT_ARGS env var (JSON array) to avoid
    # conflicts with Ape's Click-based CLI argument parser.
    env = os.environ.copy()
    env["SCRIPT_ARGS"] = json.dumps(args)

    ape_bin = os.path.join(APE_PROJECT_ROOT, ".venv", "bin", "ape")
    result = subprocess.run(
        [ape_bin, "run", script_name, "--network", "ethereum:local:foundry"],
        cwd=APE_PROJECT_ROOT,  # your Ape project root
        capture_output=True,
        text=True,
        timeout=60,
        env=env,
    )
    if result.returncode != 0:
        error_detail = f"STDERR:\n{result.stderr}\n\nSTDOUT:\n{result.stdout}".strip()
        raise RuntimeError(f"Ape script failed: {error_detail}")

    # last line of stdout is expected to be the JSON result
    last_line = result.stdout.strip().splitlines()[-1]
    return json.loads(last_line)
