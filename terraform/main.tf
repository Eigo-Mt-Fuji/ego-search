provider "aws" {
  # No credentials explicitly set here because they come from either the
  # environment or the global credentials file.
  region = "ap-northeast-1"
}
terraform {
  backend "s3" {
    region               = "ap-northeast-1"
    bucket               = "ego-search.efg.river"
    key                  = "terraform.tfstate"
  }
}

resource "aws_cloudwatch_log_group" "instance" {
  name = "/aws/ecs/ego-search-${terraform.workspace}/containers"

  tags = {
    env = "${terraform.workspace}"
    service = "${var.service_name}"
  }
}

resource "aws_ssm_parameter" "github_access_token" {
  name = "EGO_SEARCH_GITHUB_ACCESS_TOKEN_${terraform.workspace}"
  type = "SecureString"
  description = "SSM Parameter of github access token"
  value = "${var.github_access_token}"
}
resource "aws_ssm_parameter" "youtube_api_key" {
  name = "EGO_SEARCH_YOUTUBE_API_KEY_${terraform.workspace}"
  type = "SecureString"
  description = "SSM Parameter of youtube api key"
  value = "${var.youtube_api_key}"
}

resource "aws_ssm_parameter" "twitter_consumer_key" {
  name = "EGO_SEARCH_TWITTER_CONSUMER_KEY_${terraform.workspace}"
  type = "SecureString"
  description = "SSM Parameter of twitter consumer key"
  value = "${var.twitter_consumer_key}"
}
resource "aws_ssm_parameter" "twitter_consumer_secret" {
  name = "EGO_SEARCH_TWITTER_CONSUMER_SECRET_${terraform.workspace}"
  type = "SecureString"
  description = "SSM Parameter of twitter consumer secret"
  value = "${var.twitter_consumer_secret}"
}

resource "aws_ssm_parameter" "twitter_access_token_key" {
  name = "EGO_SEARCH_TWITTER_ACCESS_TOKEN_KEY_${terraform.workspace}"
  type = "SecureString"
  description = "SSM Parameter of twitter access token key"
  value = "${var.twitter_access_token_key}"
}
resource "aws_ssm_parameter" "twitter_access_token_secret" {
  name = "EGO_SEARCH_TWITTER_ACCESS_TOKEN_SECRET_${terraform.workspace}"
  type = "SecureString"
  description = "SSM Parameter of twitter access token secret"
  value = "${var.twitter_access_token_secret}"
}

resource "aws_s3_bucket" "result" {
  bucket = "ego-search.result.efg.river"
  acl =  "private"

  versioning {
    enabled = true
  }

  tags = {
    Name = "ego-search.result.efg.river"
    env = "${terraform.workspace}"
    service = "${var.service_name}"
  }
}

resource "aws_ecr_repository" "instance" {
  name = "ego-search-${terraform.workspace}"
}

resource "aws_ecs_cluster" "instance" {
  name = "ego-search-cluster-${terraform.workspace}"
}

module "ego-search" {
  source = "./modules/ego-task" 
  attributes = {
    task_name = "search-batch" # task name
    schedule_expression = "cron(0 1 * * ? *)" # see https://docs.aws.amazon.com/ja_jp/AmazonCloudWatch/latest/events/ScheduledEvents.html
    task_command = [ "npm", "run", "start" ] # see https://docs.docker.com/engine/reference/builder/#cmd

    cluster_arn = "${aws_ecs_cluster.instance.arn}"
    private_subnets = ["subnet-36df756f"]
    awslogs_group = "${aws_cloudwatch_log_group.instance.name}"
    ssm_arn_google_youtube_api_key = "${aws_ssm_parameter.youtube_api_key.name}"
    ssm_arn_twitter_consumer_key = "${aws_ssm_parameter.twitter_consumer_key.name}"
    ssm_arn_twitter_consumer_secret = "${aws_ssm_parameter.twitter_consumer_secret.name}"
    ssm_arn_twitter_access_token_key = "${aws_ssm_parameter.twitter_access_token_key.name}"
    ssm_arn_twitter_access_token_secret = "${aws_ssm_parameter.twitter_access_token_secret.name}"
    image_repository_url = "${aws_ecr_repository.instance.repository_url}"
    image_tag = "latest"
    cpu_units = 256 # see Task CPU and Memory https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html 
    memory_mib = 1024 # see Task CPU and Memory https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html
    is_enabled = true # please set false only-if expected to stop the task in temporary. 
    cost_tag_service = "${var.service_name}"
    cost_tag_env = "${terraform.workspace}"
    fargate_platform_version = "1.3.0" # FARGATE platform version https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html
  }
}


module "ego_cicd" {
  source = "./modules/ego-pipeline"

  base_name = "ego-search"
  github_token_ssm_parameter_name = "${aws_ssm_parameter.github_access_token.name}"
  ssm_arn_google_youtube_api_key = "${aws_ssm_parameter.youtube_api_key.name}"
  ssm_arn_twitter_consumer_key = "${aws_ssm_parameter.twitter_consumer_key.name}"
  ssm_arn_twitter_consumer_secret = "${aws_ssm_parameter.twitter_consumer_secret.name}"
  ssm_arn_twitter_access_token_key = "${aws_ssm_parameter.twitter_access_token_key.name}"
  ssm_arn_twitter_access_token_secret = "${aws_ssm_parameter.twitter_access_token_secret.name}"
  deploy_bucket = "ego-search.efg.river"
  service_name = "ego-search"
  github_organization = "Eigo-Mt-Fuji"
  github_repository_name = "ego-search"
  github_branch = "master"
  github_oauth_token = "${var.github_oauth_token}"
  build_compute_type = "BUILD_GENERAL1_SMALL"
}