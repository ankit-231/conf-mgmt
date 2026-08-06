from decouple import Config, RepositoryEnv


def get_config(is_production: bool = True, base_path: str = ".") -> Config:
    """
    Load `.env` or `.env.prod` according to is_production.

    :param is_production: Whether to load the production config, defaults to True
    :return: decouple.Config instance choosing .env or .env.prod by the is_production value
    :rtype: decouple.Config
    """

    config_file = ".env.prod" if is_production else ".env"
    config = Config(RepositoryEnv(f"{base_path}/{config_file}"))

    return config


def print_green(text: str):
    print(f"\033[92m{text}\033[0m")


def print_yellow(text: str):
    print(f"\033[93m{text}\033[0m")
