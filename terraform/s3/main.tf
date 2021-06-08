variable "site_name" {
  type = string
  description = "Site name"
}

variable "oai_iam_arn" {
  type = string
  description = "Site name"
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    principals {
      type        = "AWS"
      identifiers = [var.oai_iam_arn]
    }
    actions   = ["s3:GetObject"]
    resources = ["arn:aws:s3:::${var.site_name}/*"]
  }
}

resource "aws_s3_bucket" "origin" {
  bucket = var.site_name
  acl = "private"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
  tags = {
    Name = var.site_name
  }
  force_destroy = true
}

resource "aws_s3_bucket_policy" "repo" {
  bucket = aws_s3_bucket.origin.bucket
  policy = data.aws_iam_policy_document.s3_policy.json
}

output "s3_origin_bucket" {
  value = aws_s3_bucket.origin
  sensitive = true
}
