"""Command line entry point: `uv run site build | serve | check`."""

import argparse


def main() -> None:
    parser = argparse.ArgumentParser(prog="site", description="Build, preview and check oscarmoreno.com.")
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("build", help="build the site into dist/")
    serve = commands.add_parser("serve", help="build, then serve dist/ locally")
    serve.add_argument("--port", type=int, default=1313)
    commands.add_parser("check", help="check dist/ for missing live URLs and broken links")
    args = parser.parse_args()

    # Imported here so each command only loads what it needs.
    if args.command == "build":
        from .build import build

        build()
    elif args.command == "serve":
        from .build import build
        from .serve import serve

        build()
        serve(args.port)
    elif args.command == "check":
        from .check import check

        raise SystemExit(check())
