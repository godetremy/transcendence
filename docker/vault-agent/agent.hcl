pid_file = "/tmp/vault-agent.pid"

vault {
  address = "http://vault:8200"
}

auto_auth {
  method "token_file" {
    config = {
      token_file_path = "/vault/agent/token/root.token"
    }
  }

  sink "file" {
    config = {
      path = "/vault/agent/token/agent.token"
    }
  }
}

template {
  source      = "/etc/vault/templates/app-config.ctmpl"
  destination = "/vault/agent/rendered/app-config.env"
}
