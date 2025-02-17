vpc_name = "my-vpc"
vpc_cidr = "10.0.0.0/16"

public_subnets = [
  "10.0.1.0/24",
  "10.0.2.0/24"
]

private_subnets = [
  "10.0.3.0/24",
   "10.0.4.0/24"
]

az = [
  "ap-south-1a",
  "ap-south-1b"

]

region = "ap-south-1"


cluster_name     = "my-eks-cluster"
cluster_version  = "1.27"
desired_capacity = 2
min_capacity     = 2
max_capacity     = 2
instance_types   = ["t3.large"]