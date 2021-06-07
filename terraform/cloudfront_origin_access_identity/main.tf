variable "site_name" {
  type = string
  description = "Site name"
}

resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = var.site_name
}

output "oai_cloudfront_access_identity_path" {
  value = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
}

output "oai_iam_arn" {
  value = aws_cloudfront_origin_access_identity.oai.iam_arn
}
