using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace NumbersGenerator
{
    class NumGenerator
    {
        // A simple class that allow generate random numbers in a range of doubles.

        // Random generator. Should be the same for all instances to avoid getting same seed in differents instances.
        private static readonly Random random = new Random();
        public static string STARTED = "STARTED";
        public static string STOPPED = "STOPPED ";

        // Object Id
        public string Name { get; }
        // Redis Subscriber
        public ISubscriber Sub { get; }
        // Redis Subscriber
        private CancellationTokenSource TokenSource { get; set; }
        // Smallest number of the range
        public double Min { get; set; }
        // Biggest number of the range
        public double Max { get; set; }
        // Time elapsed between two generations (ms)
        public int Time { get; set; }
        // Time elapsed between two generations (ms)
        public string Status { get; private set; }

        public NumGenerator(string name, ISubscriber sub)
        {
            Name = name;
            Sub = sub;
            Min = 0;
            Max = 10;
            Time = 100;
            Status = STOPPED;
        }


        /* 
         * This method start a task where a double number between 0 and 1 is generated and transformed 
         * to fix with Min-Max range. Then, it generate a json response and send it by redis subcriber.
         * Finally, it repeats it each time given by Time variable until Stop method is called.
         */
        public void Start()
        {
            if (Status == STOPPED)
            {
                TokenSource = new CancellationTokenSource();
                Task generateTask = new Task(() =>
                {
                    while (true)
                    {
                        double generatedNumber = random.NextDouble() * (Max - Min) + Min;
                        Sub.Publish("ClientMessages",
                            "{\"action\":\"numberGenerated\", " +
                            "\"axis\":\"" + Name + "\", " +
                            "\"generatedNumber\":\"" + generatedNumber + "\"}");
                        System.Threading.Thread.Sleep(Time);
                        if (TokenSource.Token.IsCancellationRequested)
                        {
                            break;
                        }
                    }
                }, TokenSource.Token);
                Status = STARTED;
                generateTask.Start();
            }
        }

        public void Stop()
        {
            if (Status == STARTED)
            {
                TokenSource.Cancel();
                Status = STOPPED;
            }
        }

        public void Update(Dictionary<string, string> json)
        {
            if (json.ContainsKey("min"))
                Min = Convert.ToDouble(json["min"]);
            if (json.ContainsKey("max"))
                Max = Convert.ToDouble(json["max"]);
            if (json.ContainsKey("time"))
                Time = Convert.ToInt16(json["time"]);
        }
    }
}
