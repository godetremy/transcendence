pid_file = "/tmp/vault-agent.pid"

vault {
  address = "http://vault:8200"
}

cache {
  use_auto_auth_token = true
}

listener "tcp" {
  address = "127.0.0.1:8100"
  tls_disable = true
}

auto_auth {
  method "token_file" {
    config = {
      token_file_path = "/vault/agent/token/app.token"
    }
  }

  sink "file" {
    config = {
      path = "/vault/agent/token/agent.token"
      mode = 0400
    }
  }
}

template {
  source      = "/etc/vault/templates/app-config.ctmpl"
  destination = "/vault/agent/rendered/app-config.env"
  perms       = "0400"
  error_on_missing_key = true
}
