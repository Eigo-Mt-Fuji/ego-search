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

resource "aws_ssm_parameter" "youtube_api_key" {
  name = "EGO_SEARCH_YOUTUBE_API_KEY_${terraform.workspace}"
  type = "SecureString"
  description = "SSM Parameter of youtube api key"
  value = "${var.youtube_api_key}"
}

resource "aws_ssm_parameter" "twitter_api_key" {
  name = "EGO_SEARCH_TWITTER_API_KEY_${terraform.workspace}"
  type = "SecureString"
  description = "SSM Parameter of twitter api key"
  value = "${var.twitter_api_key}"
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
    ssm_google_youtube_api_key = "${aws_ssm_parameter.youtube_api_key.name}"
    ssm_twitter_api_key = "${aws_ssm_parameter.twitter_api_key.name}"
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
