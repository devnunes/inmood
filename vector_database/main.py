import sys
import subprocess

from transformers import AutoTokenizer
def main():
        sys.exit(subprocess.call(["chroma", "run", "config.yaml"]))

if __name__ == "__main__":
    main()
