#!/usr/bin/ruby
require "adler32"
for arg in ARGV
  puts (Adler32.checksum arg)
end
