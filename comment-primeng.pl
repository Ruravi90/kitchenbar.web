#!/usr/bin/perl
use strict;
use warnings;

my $file = $ARGV[0];
open(my $fh, '<', $file) or die "Cannot open $file: $!";
my @lines = <$fh>;
close($fh);

my $output = '';
my $in_block = 0;
my $block_name = '';

foreach my $line (@lines) {
  # Don't comment .container blocks
  if ($line =~ /^\.(\w+)-container/) {
    $output .= $line;
    next;
  }
  
  # Start of PrimeNG block
  if ($line =~ /^\/\* (Search Input|Table Styles|Dialog Styles|Buttons|Divider|Confirm Dialog) /) {
    $block_name = $1;
    $in_block = 1;
    $output .= "/* $block_name - COMMENTED TO USE GLOBALS */\n";
    $output .= "/*\n";
    $output .= $line;
    next;
  }
  
  # End PrimeNG block when we hit blank line + another comment or EOF
  if ($in_block && ($line =~ /^$/|| eof)) {
    # Check next line
    $output .= $line;
    if ($line =~ /^$/) {
      $output .= "*/\n";
      $in_block = 0;
    }
    next;
  }
  
  $output .= $line;
}

# Write back
open($fh, '>', $file) or die "Cannot write $file: $!";
print $fh $output;
close($fh);
