variable "github_organization" {
  default = "giftee"
}
variable "github_repository_name" {
  default = "giftee-domain-e-gift.co"
}

variable "github_branch" {
  default = "master"
}
variable "github_oauth_token" {
  default = ""
}

variable "base_name" { 
  default = ""
}
variable "deploy_bucket" {
  default = ""
}
variable "build_compute_type" {
  default = "build.general1.small"
}
variable "github_token_ssm_parameter_name" {
  default = ""
}
variable "service_name" {

  default = ""
}

variable "ssm_arn_google_youtube_api_key" {

  default = ""
}
variable "ssm_arn_twitter_consumer_key" {
  
  default = ""
}
variable "ssm_arn_twitter_consumer_secret" {
  
  default = ""
}
variable "ssm_arn_twitter_access_token_key" {
  
  default = ""
}
variable "ssm_arn_twitter_access_token_secret" {
  
  default = ""
}
