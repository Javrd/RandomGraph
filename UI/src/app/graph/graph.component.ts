import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MessagesService } from '../messages.service';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';

@Component({
    selector: 'app-graph',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {

  private margin = {top: 20, right: 20, bottom: 30, left: 50};
  private width: number;
  private height: number;
  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;
  private xAxis: any;
  private yAxis: any;
  private x: number;
  private y: number;
  private statusX: string;
  private statusY: string;
  private svg: any;
  private tip: any;
  private point: d3Shape.Symbol<this, [number, number]>;

  constructor(private messages: MessagesService) {
    this.width = 500 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.messages.sendMsg({'action': 'getXInfo'});
    this.messages.sendMsg({'action': 'getYInfo'});
    this.messages.messages.subscribe(msg => {
      if (msg.action === 'info') {
        if (msg.axis === 'x') {
          this.minX = msg.min;
          this.maxX = msg.max;
          this.statusX = msg.status;
        } else {
          this.minY = msg.min;
          this.maxY = msg.max;
          this.statusY = msg.status;
        }
        if (this.minX && this.maxX && this.maxY && this.minY) {
          this.initSvg();
          this.initAxis();
          this.drawAxis();
        }
      }
    });
    this.messages.messages.subscribe(msg => {
      if (msg.action === 'numberGenerated') {
        this[msg.axis] = Number(msg.generatedNumber.replace(/,/g, '.'));
        this.drawPoint();
      }
    });
  }

  private initSvg() {
    d3.select('svg').selectAll('*').remove();
    d3.select('#tip').remove();
    this.svg = d3.select('svg')
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    this.tip = d3.select('body').append('div')
        .attr('id', 'tip')
        .attr('class', 'tooltip')
        .style('display', 'none');
  }

  private initAxis() {
    this.xAxis = d3Scale.scaleLinear().domain([this.minX, this.maxX]).range([0, this.width]);
    this.yAxis = d3Scale.scaleLinear().domain([this.minY, this.maxY]).range([this.height, 0]);
  }

  private drawAxis() {
      this.svg.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + this.height + ')')
          .call(d3Axis.axisBottom(this.xAxis));

      this.svg.append('g')
          .attr('class', 'axis axis--y')
          .call(d3Axis.axisLeft(this.yAxis));
  }

  private drawPoint() {
    this.point = d3Shape.symbol();
    if (!this.x) { this.x = 0; }
    if (!this.y) { this.y = 0; }
    this.svg.select('#point').remove();
    this.svg.append('path')
        .attr('id', 'point')
        .attr('class', 'point')
        .attr('d', this.point)
        .attr('transform', 'translate(' + this.xAxis(this.x) + ',' + this.yAxis(this.y) + ')')
        .attr('width', 140)
        .attr('height', 140)
        .on('mouseover', () => {
          this.tip.style('display', 'inline');
        })
        .on('mousemove', () => {
          this.tip.text('(' + Math.round(this.x * 1000) / 1000 + ', ' + Math.round(this.y * 1000) / 1000 + ')')
            .style('left', (d3.event.pageX - 34) + 'px')
            .style('top', (d3.event.pageY - 12) + 'px');
        })
        .on('mouseout', () => {
          this.tip.style('display', 'none');
        });
  }

  startX() {
    this.messages.sendMsg({'action': 'startX'});
    this.statusX = 'STARTED';
  }
  startY() {
    this.messages.sendMsg({'action': 'startY'});
    this.statusY = 'STARTED';
  }
  stopX() {
    this.messages.sendMsg({'action': 'stopX'});
    this.statusX = 'STOPPED ';
  }
  stopY() {
    this.messages.sendMsg({'action': 'stopY'});
    this.statusY = 'STOPPED ';
  }

}
