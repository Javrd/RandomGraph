using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace NumbersGenerator
{
    class Program
    {
        static ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("localhost");
        static void Main(string[] args)
        {
            ISubscriber sub = redis.GetSubscriber();
            NumGenerator x = new NumGenerator("x", sub);
            NumGenerator y = new NumGenerator("y", sub);    
            sub.Subscribe("ServerMessages", (channel, payload) =>
            {
                try
                {
                    Dictionary<string, string> json = 
                    JsonConvert.DeserializeObject<Dictionary<string, string>>(payload);

                    if (json.ContainsKey("action"))
                    {
                        switch (json["action"])
                        {
                            case "startX":
                                Console.WriteLine(GetLogLine() + "Action startX requested");
                                x.Start();
                                break;
                            case "startY":
                                Console.WriteLine(GetLogLine() + "Action startY requested");
                                y.Start();
                                break;
                            case "stopX":
                                Console.WriteLine(GetLogLine() + "Action stopX requested");
                                x.Stop();
                                break;
                            case "stopY":
                                Console.WriteLine(GetLogLine() + "Action stopY requested");
                                y.Stop();
                                break;
                            case "updateX":
                                Console.WriteLine(GetLogLine() + "Action updateX requested");
                                x.Update(json);
                                sub.Publish("ClientMessages", GetAxisInfo(x));
                                break;
                            case "updateY":
                                Console.WriteLine(GetLogLine() + "Action updateY requested");
                                y.Update(json);
                                sub.Publish("ClientMessages", GetAxisInfo(y));
                                break;
                            case "getXInfo":
                                Console.WriteLine(GetLogLine() + "Action getXInfo requested");
                                sub.Publish("ClientMessages", GetAxisInfo(x));
                                break;
                            case "getYInfo":
                                Console.WriteLine(GetLogLine() + "Action getYInfo requested");
                                sub.Publish("ClientMessages", GetAxisInfo(y));
                                break;
                            default:
                                Console.WriteLine(GetLogLine() + "No action defined for " + json["action"]);
                                break;
                        }
                    }
                    else if (!json.ContainsKey("axis"))
                    {
                        Console.WriteLine(GetLogLine() + "No action found in JSON");
                    }
                }
                catch (JsonReaderException e)
                {
                    Console.WriteLine(GetLogLine() + "Error: payload is not a JSON (" + e.StackTrace + ")");
                }
            });
            System.Threading.Thread.Sleep(-1);
        }

        static string GetAxisInfo(NumGenerator axis){
            return "{\"action\":\"info\", " +
                    "\"axis\":\"" + axis.Name + "\", " +
                    "\"min\":\"" + axis.Min + "\", " +
                    "\"max\":\"" + axis.Max + "\", " +
                    "\"time\":\"" + axis.Time + "\", " +
                    "\"status\":\"" + axis.Status + "\"}";
        }

        static string GetLogLine()
        {
            return $"[{ DateTime.Now.ToString("HH:mm:ss.ffff")}] ";
        }
    }
}
