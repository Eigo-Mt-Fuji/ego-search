# README

* Youtube
* Twitter
* AWS ECS Fargate
* Docker
* Terraform
* NodeJs



```
export NODE_ENV="production"
export EGO_SEARCH_KEYWORD="ドラゴンボール"
export YOUTUBE_API_KEY="AIzaSyDZqmz8_207YmBSqoO32-6yd6Glvi-r53o"
export TWITTER_CONSUMER_KEY="klJaFY5onLqU5D7BMGmw35vK4"
export TWITTER_CONSUMER_SECRET="wLyb91lqli6chgHpMwcKWtDWhPMotwqIZKL0LmD993Wfaz6uWM"
export TWITTER_ACCESS_TOKEN_KEY="98099499-j32uAtkO0yHphg0n2gOJqaHr2k2FYcJzLyEaCe3ox"
export TWITTER_ACCESS_TOKEN_SECRET="gz1GuqeLyEwwNUtPaWvsNBNjG5CsZUSQzSv9babZJk6oa"
export EGO_SEARCH_RESULT_BUCKET="ego-search.efg.river"
yarn run start 
```

```

$ terraform validate
Success! The configuration is valid.

$ terraform plan -var-file=dev.tfvars -out=terraform.plan
  + create

Terraform will perform the following actions:

  # aws_cloudwatch_log_group.instance will be created
  + resource "aws_cloudwatch_log_group" "instance" {
      + arn               = (known after apply)
      + id                = (known after apply)
      + name              = "/aws/ecs/ego-search-default/containers"
      + retention_in_days = 0
      + tags              = {
          + "env"     = "default"
          + "service" = "ego-search"
        }
    }

  # aws_ecr_repository.instance will be created
  + resource "aws_ecr_repository" "instance" {
      + arn                  = (known after apply)
      + id                   = (known after apply)
      + image_tag_mutability = "MUTABLE"
      + name                 = "ego-search-default"
      + registry_id          = (known after apply)
      + repository_url       = (known after apply)
    }

  # aws_ecs_cluster.instance will be created
  + resource "aws_ecs_cluster" "instance" {
      + arn  = (known after apply)
      + id   = (known after apply)
      + name = "ego-search-cluster-default"

      + setting {
          + name  = (known after apply)
          + value = (known after apply)
        }
    }

  # aws_s3_bucket.result will be created
  + resource "aws_s3_bucket" "result" {
      + acceleration_status         = (known after apply)
      + acl                         = "private"
      + arn                         = (known after apply)
      + bucket                      = "ego-search.result.efg.river"
      + bucket_domain_name          = (known after apply)
      + bucket_regional_domain_name = (known after apply)
      + force_destroy               = false
      + hosted_zone_id              = (known after apply)
      + id                          = (known after apply)
      + region                      = (known after apply)
      + request_payer               = (known after apply)
      + tags                        = {
          + "Name"    = "ego-search.result.efg.river"
          + "env"     = "default"
          + "service" = "ego-search"
        }
      + website_domain              = (known after apply)
      + website_endpoint            = (known after apply)

      + versioning {
          + enabled    = true
          + mfa_delete = false
        }
    }

  # aws_ssm_parameter.twitter_access_token_key will be created
  + resource "aws_ssm_parameter" "twitter_access_token_key" {
      + arn         = (known after apply)
      + description = "SSM Parameter of twitter access token key"
      + id          = (known after apply)
      + key_id      = (known after apply)
      + name        = "EGO_SEARCH_TWITTER_ACCESS_TOKEN_KEY_default"
      + tier        = "Standard"
      + type        = "SecureString"
      + value       = (sensitive value)
      + version     = (known after apply)
    }

  # aws_ssm_parameter.twitter_access_token_secret will be created
  + resource "aws_ssm_parameter" "twitter_access_token_secret" {
      + arn         = (known after apply)
      + description = "SSM Parameter of twitter access token secret"
      + id          = (known after apply)
      + key_id      = (known after apply)
      + name        = "EGO_SEARCH_TWITTER_ACCESS_TOKEN_SECRET_default"
      + tier        = "Standard"
      + type        = "SecureString"
      + value       = (sensitive value)
      + version     = (known after apply)
    }

  # aws_ssm_parameter.twitter_consumer_key will be created
  + resource "aws_ssm_parameter" "twitter_consumer_key" {
      + arn         = (known after apply)
      + description = "SSM Parameter of twitter consumer key"
      + id          = (known after apply)
      + key_id      = (known after apply)
      + name        = "EGO_SEARCH_TWITTER_CONSUMER_KEY_default"
      + tier        = "Standard"
      + type        = "SecureString"
      + value       = (sensitive value)
      + version     = (known after apply)
    }

  # aws_ssm_parameter.twitter_consumer_secret will be created
  + resource "aws_ssm_parameter" "twitter_consumer_secret" {
      + arn         = (known after apply)
      + description = "SSM Parameter of twitter consumer secret"
      + id          = (known after apply)
      + key_id      = (known after apply)
      + name        = "EGO_SEARCH_TWITTER_CONSUMER_SECRET_default"
      + tier        = "Standard"
      + type        = "SecureString"
      + value       = (sensitive value)
      + version     = (known after apply)
    }

  # aws_ssm_parameter.youtube_api_key will be created
  + resource "aws_ssm_parameter" "youtube_api_key" {
      + arn         = (known after apply)
      + description = "SSM Parameter of youtube api key"
      + id          = (known after apply)
      + key_id      = (known after apply)
      + name        = "EGO_SEARCH_YOUTUBE_API_KEY_default"
      + tier        = "Standard"
      + type        = "SecureString"
      + value       = (sensitive value)
      + version     = (known after apply)
    }

  # module.ego-search.aws_cloudwatch_event_rule.event_rule will be created
  + resource "aws_cloudwatch_event_rule" "event_rule" {
      + arn                 = (known after apply)
      + description         = "cloudwatch_event_rule-search-batch-default"
      + id                  = (known after apply)
      + is_enabled          = true
      + name                = "cloudwatch_event_rule-search-batch-default"
      + schedule_expression = "cron(0 1 * * ? *)"
    }

  # module.ego-search.aws_cloudwatch_event_target.event_target will be created
  + resource "aws_cloudwatch_event_target" "event_target" {
      + arn       = (known after apply)
      + id        = (known after apply)
      + role_arn  = (known after apply)
      + rule      = "cloudwatch_event_rule-search-batch-default"
      + target_id = (known after apply)

      + ecs_target {
          + launch_type         = "FARGATE"
          + platform_version    = "1.3.0"
          + task_count          = 1
          + task_definition_arn = (known after apply)

          + network_configuration {
              + assign_public_ip = false
              + subnets          = [
                  + "subnet-36df756f",
                ]
            }
        }
    }

  # module.ego-search.aws_ecs_task_definition.task will be created
  + resource "aws_ecs_task_definition" "task" {
      + arn                      = (known after apply)
      + container_definitions    = (known after apply)
      + cpu                      = "256"
      + execution_role_arn       = (known after apply)
      + family                   = "search-batch-default"
      + id                       = (known after apply)
      + memory                   = "1024"
      + network_mode             = "awsvpc"
      + requires_compatibilities = [
          + "FARGATE",
        ]
      + revision                 = (known after apply)
      + tags                     = {
          + "env"     = "default"
          + "service" = "ego-search"
        }
      + task_role_arn            = (known after apply)
    }

  # module.ego-search.aws_iam_role.ecs_event will be created
  + resource "aws_iam_role" "ecs_event" {
      + arn                   = (known after apply)
      + assume_role_policy    = jsonencode(
            {
              + Statement = [
                  + {
                      + Action    = "sts:AssumeRole"
                      + Effect    = "Allow"
                      + Principal = {
                          + Service = "events.amazonaws.com"
                        }
                      + Sid       = ""
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + create_date           = (known after apply)
      + force_detach_policies = false
      + id                    = (known after apply)
      + max_session_duration  = 3600
      + name                  = "ecs_event_role-search-batch-default"
      + path                  = "/"
      + unique_id             = (known after apply)
    }

  # module.ego-search.aws_iam_role.execution_role will be created
  + resource "aws_iam_role" "execution_role" {
      + arn                   = (known after apply)
      + assume_role_policy    = jsonencode(
            {
              + Statement = [
                  + {
                      + Action    = "sts:AssumeRole"
                      + Effect    = "Allow"
                      + Principal = {
                          + Service = "ecs-tasks.amazonaws.com"
                        }
                      + Sid       = ""
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + create_date           = (known after apply)
      + force_detach_policies = false
      + id                    = (known after apply)
      + max_session_duration  = 3600
      + name                  = "execution_role-search-batch-default"
      + path                  = "/"
      + unique_id             = (known after apply)
    }

  # module.ego-search.aws_iam_role.task_role will be created
  + resource "aws_iam_role" "task_role" {
      + arn                   = (known after apply)
      + assume_role_policy    = jsonencode(
            {
              + Statement = [
                  + {
                      + Action    = "sts:AssumeRole"
                      + Effect    = "Allow"
                      + Principal = {
                          + Service = "ecs-tasks.amazonaws.com"
                        }
                      + Sid       = ""
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + create_date           = (known after apply)
      + force_detach_policies = false
      + id                    = (known after apply)
      + max_session_duration  = 3600
      + name                  = "task_role-search-batch-default"
      + path                  = "/"
      + unique_id             = (known after apply)
    }

  # module.ego-search.aws_iam_role_policy.ecs_event_policy will be created
  + resource "aws_iam_role_policy" "ecs_event_policy" {
      + id     = (known after apply)
      + name   = "ecs_event_role_policy-search-batch-default"
      + policy = jsonencode(
            {
              + Statement = [
                  + {
                      + Action   = "iam:PassRole"
                      + Effect   = "Allow"
                      + Resource = "*"
                    },
                  + {
                      + Action   = "ecs:RunTask"
                      + Effect   = "Allow"
                      + Resource = "*"
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + role   = (known after apply)
    }

  # module.ego-search.aws_iam_role_policy.task_role_policy will be created
  + resource "aws_iam_role_policy" "task_role_policy" {
      + id     = (known after apply)
      + name   = "task_role_policy-search-batch-default"
      + policy = jsonencode(
            {
              + Statement = [
                  + {
                      + Action   = "*"
                      + Effect   = "Allow"
                      + Resource = "*"
                    },
                ]
              + Version   = "2012-10-17"
            }
        )
      + role   = (known after apply)
    }

  # module.ego-search.aws_iam_role_policy_attachment.execution_role_policy will be created
  + resource "aws_iam_role_policy_attachment" "execution_role_policy" {
      + id         = (known after apply)
      + policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
      + role       = "execution_role-search-batch-default"
    }

  # module.ego-search.aws_iam_role_policy_attachment.execution_role_ssm_readonly_policy will be created
  + resource "aws_iam_role_policy_attachment" "execution_role_ssm_readonly_policy" {
      + id         = (known after apply)
      + policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
      + role       = "execution_role-search-batch-default"
    }

Plan: 19 to add, 0 to change, 0 to destroy.
```
