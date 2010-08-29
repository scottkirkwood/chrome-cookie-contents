#!/usr/bin/python
#
# Copyright 2010 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Make the icons for each size."""

__author__ = 'scottkirkwood@google.com (Scott Kirkwood)'

import os
import subprocess
import sys

def make_one(source, dest, w, h):
  """Create on image from svg source.
  Args:
    source: the svg filename
    dest: the png filename.
    w: width in pixels
    h: height in pixels
  """
  args = [
      'inkscape',
      '--export-area-page',
      '--export-png', dest,
      '--export-width', str(w),
      '--export-height', str(h),
      source
  ]
  ret = subprocess.call(args)
  if ret:
    print 'Failed to make image with %s' % ' '.join(args)
    sys.exit(-1)

def make_em(source, dest_format, sizes):
  """Create the images:
  Args:
    source: is the svg filename to use
    dest_format: is the name%dx%d.png file to output.
    sizes: list of size to export to.
  """
  for s in sizes:
    dest_fname = dest_format % s
    make_one(source, dest_fname, s, s)

def main():
  sizes = [128, 19, 48,
           32, 16]
  make_em('docs/icon.svg', 'icon-%d.png', sizes)

if __name__ == '__main__':
  main()
