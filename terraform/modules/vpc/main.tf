resource "aws_vpc" "vpc" {
  cidr_block = var.vpc_cidr
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Name = var.vpc_name
  }
}

resource "aws_subnet" "public" {
  count = length(var.public_subnets)
  
  vpc_id = aws_vpc.vpc.id
  cidr_block = var.public_subnets[count.index]
  availability_zone = var.az[count.index]

  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-${count.index + 1}"
    "kubernetes.io/role/internal-elb" = "1"
  }

}

resource "aws_subnet" "private" {
   count = length(var.private_subnets)

   vpc_id = aws_vpc.vpc.id
   cidr_block = var.private_subnets[count.index]
   availability_zone = var.az[count.index]

   tags = {
     Name = "private-subnet-${count.index+1}"
   }
}
resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.vpc.id

    tags = {
        Name = "igw-${var.vpc_name}"
    }
}

resource "aws_eip" "nat" {
  domain = "vpc"
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id = aws_subnet.public[0].id

  tags = {
    Name = "nat-gateway"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "public" {
   count = length(var.public_subnets)
   subnet_id = aws_subnet.public[count.index].id
   route_table_id = aws_route_table.public.id

}

resource "aws_route_table" "private" {
   vpc_id = aws_vpc.vpc.id
   
   route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
   }
}

resource "aws_route_table_association" "private" {
   count = length(var.private_subnets)
   subnet_id = aws_subnet.private[count.index].id
   route_table_id = aws_route_table.private.id
}

