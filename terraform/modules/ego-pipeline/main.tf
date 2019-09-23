
### CodePipeline
resource "aws_codepipeline" "ego_pipeline" {
  name     = "${var.base_name}-pipeline"
  role_arn = "${aws_iam_role.ego_pipeline_role.arn}"

  artifact_store {
    location = var.deploy_bucket
    type     = "S3"
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "ThirdParty"
      provider         = "GitHub"
      version          = "1"
  
      output_artifacts = ["source_output"]

      configuration = {
        Owner  = "${var.github_organization}"
        Repo   = "${var.github_repository_name}"
        Branch = "${var.github_branch}"
        OAuthToken = "${var.github_oauth_token}"
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["source_output"]
      output_artifacts = ["build_output"]
      version          = "1"

      configuration = {
        ProjectName = aws_codebuild_project.ego_build.name
      }
    }
  }
}

### CodeBuild

resource "aws_codebuild_project" "ego_build" {
  name          = "${var.base_name}-cd-${terraform.workspace}"
  description   = "${terraform.workspace} ${var.base_name} cd build project"
  build_timeout = "20"
  service_role  = "${aws_iam_role.ego_build_role.arn}"

  source {
    git_clone_depth     = 0
    insecure_ssl        = false
    report_build_status = false
    type = "CODEPIPELINE"
  }

  artifacts {
    type = "CODEPIPELINE"
  }

  cache {
    type     = "LOCAL"
    modes = ["LOCAL_DOCKER_LAYER_CACHE", "LOCAL_SOURCE_CACHE", "LOCAL_CUSTOM_CACHE"]
  }

  environment {
    compute_type = "${var.build_compute_type}"
    image                       = "aws/codebuild/standard:2.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    # Workspace 
    environment_variable {
      name  = "WORKSPACE"
      value = "${terraform.workspace}"
      type = "PLAINTEXT"
    }
    environment_variable {
      name  = "DRY_RUN"
      value = "true"
#      value = "false"
      type = "PLAINTEXT"
    }
    environment_variable {
      name  = "GITHUB_ORGANIZATION"
      value = "${var.github_organization}"
      type = "PLAINTEXT"
    }
    environment_variable {
      name  = "GITHUB_REPOSITORY_NAME"
      value = "${var.github_repository_name}"
      type = "PLAINTEXT"
    }
    environment_variable {
      name  = "GITHUB_PERSONAL_ACCESSTOKEN"
      value = "${var.github_token_ssm_parameter_name}"
      type = "PARAMETER_STORE"
    }
    environment_variable {
      name  = "YOUTUBE_API_KEY"
      value = "${var.attributes.ssm_arn_google_youtube_api_key}"
      type = "PARAMETER_STORE"
    }
    environment_variable {
      name  = "TWITTER_CONSUMER_KEY"
      value = "${var.attributes.ssm_arn_twitter_consumer_key}"
      type = "PARAMETER_STORE"
    }
    environment_variable {
      name  = "TWITTER_CONSUMER_SECRET"
      value = "${var.attributes.ssm_arn_twitter_consumer_secret}"
      type = "PARAMETER_STORE"
    }
    environment_variable {
      name  = "TWITTER_ACCESS_TOKEN_KEY"
      value = "${var.attributes.ssm_arn_twitter_access_token_key}"
      type = "PARAMETER_STORE"
    }
    environment_variable {
      name  = "TWITTER_ACCESS_TOKEN_SECRET"
      value = "${var.attributes.ssm_arn_twitter_access_token_secret}"
      type = "PARAMETER_STORE"
    }
  }

  tags = {
    service = "${var.service_name}"
    env = "${terraform.workspace}"
  }
}

resource "aws_iam_role" "ego_pipeline_role" {
  name = "${var.base_name}-pipeline-role-${terraform.workspace}"
  assume_role_policy = templatefile("${path.module}/templates/code-pipeline-assume-role-policy.json", {})
}

resource "aws_iam_role_policy" "ego_pipeline_policy" {
  name = "${var.base_name}-pipeline-policy"
  role = "${aws_iam_role.ego_pipeline_role.id}"
  policy = templatefile("${path.module}/templates/code-pipeline-policy.json", {
    deploy_s3_bucket_name = "${var.deploy_bucket}"
  })
}

resource "aws_iam_role" "ego_build_role" {
  name = "${var.base_name}-role-${terraform.workspace}"

  assume_role_policy = templatefile("${path.module}/templates/code-build-assume-role-policy.json", {})
}

resource "aws_iam_role_policy" "ego_build_role_policy" {
  role = "${aws_iam_role.ego_build_role.name}"
  policy = templatefile("${path.module}/templates/code-build-role-policy.json", {})
}


## ci

resource "aws_iam_role" "ego_build_ci_role" {
  name = "${var.base_name}-ci-${terraform.workspace}"

  assume_role_policy = templatefile("${path.module}/templates/code-build-ci-assume-role-policy.json", {})
}

resource "aws_iam_role_policy" "ci_role_policy" {
  role = "${aws_iam_role.ego_build_ci_role.name}"
  policy = templatefile("${path.module}/templates/code-build-ci-role-policy.json", {})
}

resource "aws_codebuild_project" "ego_build_ci" {
  name          = "${var.base_name}-ci-${terraform.workspace}"
  description   = "${terraform.workspace} ${var.base_name} ci build project"
  build_timeout = "20"
  service_role  = "${aws_iam_role.ego_build_ci_role.arn}"
  badge_enabled = false
  artifacts {
    type = "NO_ARTIFACTS"
  }

  cache {
    type     = "LOCAL"
    modes = ["LOCAL_DOCKER_LAYER_CACHE", "LOCAL_SOURCE_CACHE", "LOCAL_CUSTOM_CACHE"]
  }

  environment {
    compute_type                = "${var.build_compute_type}"
    image                       = "aws/codebuild/standard:2.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "WORKSPACE"
      value = "${terraform.workspace}"
      type = "PLAINTEXT"
    }

    environment_variable {
      name  = "DRY_RUN"
      value = "true"
      type = "PLAINTEXT"
    }
    environment_variable {
      name  = "GITHUB_ORGANIZATION"
      value = "${var.github_organization}"
      type = "PLAINTEXT"
    }
    environment_variable {
      name  = "GITHUB_REPOSITORY_NAME"
      value = "${var.github_repository_name}"
      type = "PLAINTEXT"
    }
    environment_variable {
      name  = "GITHUB_PERSONAL_ACCESSTOKEN"
      value = "${var.github_token_ssm_parameter_name}"
      type = "PARAMETER_STORE"
    }
    environment_variable {
      name  = "YOUTUBE_API_KEY"
      value = "${var.attributes.ssm_arn_google_youtube_api_key}"
      type = "PARAMETER_STORE"
    }
    environment_variable {
      name  = "TWITTER_CONSUMER_KEY"
      value = "${var.attributes.ssm_arn_twitter_consumer_key}"
      type = "PARAMETER_STORE"
    }
    environment_variable {
      name  = "TWITTER_CONSUMER_SECRET"
      value = "${var.attributes.ssm_arn_twitter_consumer_secret}"
      type = "PARAMETER_STORE"
    }
    environment_variable {
      name  = "TWITTER_ACCESS_TOKEN_KEY"
      value = "${var.attributes.ssm_arn_twitter_access_token_key}"
      type = "PARAMETER_STORE"
    }
    environment_variable {
      name  = "TWITTER_ACCESS_TOKEN_SECRET"
      value = "${var.attributes.ssm_arn_twitter_access_token_secret}"
      type = "PARAMETER_STORE"
    }
  }

  source {
    type            = "GITHUB"
    location        = "https://github.com/${var.github_organization}/${var.github_repository_name}"
    git_clone_depth = 1
    report_build_status = true
  }

  tags = {
    service = "${var.service_name}"
    env = "${terraform.workspace}"
  }
}

resource "aws_codebuild_webhook" "ci_webhook" {
  project_name = "${aws_codebuild_project.ego_build_ci.name}"

  filter_group {
    filter {
      type = "EVENT"
      pattern = "PUSH,PULL_REQUEST_CREATED,PULL_REQUEST_UPDATED"
    }
  }
}
