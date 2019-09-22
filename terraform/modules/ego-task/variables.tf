variable "attributes" {
    type = object({ 
        cluster_arn = string,
        private_subnets = list(string),
        awslogs_group = string,
        ssm_arn_slack_webhook_url_deploy = string,
        ssm_arn_rails_master_key = string,
        ssm_arn_database_url = string,
        image_repository_url = string,
        image_tag = string,
        cpu_units = number,
        memory_mib = number,
        is_enabled = bool,
        fargate_platform_version = string,
        cost_tag_service = string,
        cost_tag_env = string
        rails_env = string
        task_name = string,
        task_command = list(string),
        schedule_expression = string
    })
        
    default = {
        cluster_arn = ""
        private_subnets = []
        awslogs_group = ""
        ssm_google_youtube_api_key = ""
        ssm_twitter_api_key = ""
        image_repository_url = ""
        image_tag = "latest"
        cpu_units = 256 
        memory_mib = 1024 
        is_enabled = true
        cost_tag_service = ""
        cost_tag_env = ""
        fargate_platform_version = "1.3.0"
        task_name = "search-batch" # task name
        schedule_expression = "cron(0 1 * * ? *)"
        task_command = [ "npm", "run", "start" ] 
    }
}
