from utils import generate_auth_code, read_settings, write_settings


def test_generate_auth_code():
    terminal_number = '5'
    code = generate_auth_code(terminal_number)
    assert len(code) == 13
    assert code.startswith(terminal_number)


def test_writing_settings():
    settings = read_settings()
    assert "TEST" not in settings

    settings["TEST"] = {"test_value": 1}
    write_settings(settings)

    settings = read_settings()
    assert "TEST" in settings
    assert int(settings["TEST"]["test_value"]) == 1

    del settings["TEST"]
    write_settings(settings)
