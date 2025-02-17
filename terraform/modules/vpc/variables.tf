variable "vpc_name" {
  type = string
}

variable "vpc_cidr" {
  type = string
}

variable "public_subnets" {
   type = list(string)
}

variable "private_subnets" {
   type = list(string)
}

variable "az" {
  type = list(string)
}
variable "eks_cluster_name" {
  type = string
}